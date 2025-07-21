import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ["https://advancespotify.onrender.com", "http://localhost:5173", "http://localhost:3000"],
			credentials: true,
		},
	});

	const userSockets = new Map(); // Map<userId, socketId>
	const userActivities = new Map(); // Map<userId, activity>
	const listenAlongSessions = new Map(); // Map<hostUserId, Set<listenerSocketId>>

	io.on("connection", (socket) => {
		const userId = socket.handshake.auth.userId;
		if (userId) {
			userSockets.set(userId, socket.id);
			socket.userId = userId;
		}

		socket.emit("users_online", Array.from(userSockets.keys()));
		io.emit("activities", Array.from(userActivities.entries()));

		socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id);
			socket.userId = userId;
			userActivities.set(userId, "Idle");
			io.emit("user_connected", userId);
		});

		socket.on("update_activity", ({ userId, activity }) => {
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;
				const message = await Message.create({ senderId, receiverId, content });
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		// --- Listen Along Logic ---

		socket.on("listen-along:start", ({ hostUserId }) => {
			const hostSocketId = userSockets.get(hostUserId);
			if (!hostSocketId) {
				socket.emit("listen-along:error", { message: "Host is not online." });
				return;
			}
			socket.join(hostUserId);
			if (!listenAlongSessions.has(hostUserId)) {
				listenAlongSessions.set(hostUserId, new Set());
			}
			listenAlongSessions.get(hostUserId).add(socket.id);

			// Notify host that a listener joined
			io.to(hostSocketId).emit("listen-along:listener-joined", { listenerId: socket.userId });

			io.to(hostSocketId).emit("listen-along:request-sync", { listenerId: socket.id });
		});

		socket.on("listen-along:sync-state", ({ listenerId, playerState }) => {
			io.to(listenerId).emit("listen-along:sync", playerState);
		});

		socket.on("player:state-update", (playerState) => {
			if (socket.userId) {
				socket.to(socket.userId).emit("listen-along:update", playerState);
			}
		});

		socket.on("listen-along:stop", ({ hostUserId }) => {
			socket.leave(hostUserId);
			const hostSocketId = userSockets.get(hostUserId);
			if (hostSocketId) {
				io.to(hostSocketId).emit("listen-along:listener-left", { listenerId: socket.userId });
			}
			if (listenAlongSessions.has(hostUserId)) {
				listenAlongSessions.get(hostUserId).delete(socket.id);
			}
		});

		// --- Handle Disconnects ---
		socket.on("disconnect", () => {
			if (socket.userId) {
				if (listenAlongSessions.has(socket.userId)) {
					io.to(socket.userId).emit("listen-along:host-disconnected");
					listenAlongSessions.delete(socket.userId);
				}

				listenAlongSessions.forEach((listeners, hostId) => {
					if (listeners.has(socket.id)) {
						listeners.delete(socket.id);
						const hostSocketId = userSockets.get(hostId);
						if (hostSocketId) {
							io.to(hostSocketId).emit("listen-along:listener-left", { listenerId: socket.userId });
						}
					}
				});

				userSockets.delete(socket.userId);
				userActivities.delete(socket.userId);
				io.emit("user_disconnected", socket.userId);
			}
		});
	});
};
