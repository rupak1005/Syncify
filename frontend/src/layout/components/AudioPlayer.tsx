import { usePlayerStore } from "@/stores/usePlayerStore";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const {
		currentSong,
		isPlaying,
		playNext,
		isListeningAlong,
		listenAlongHost,
		syncPlayerState,
		stopListeningAlong,
		addListener,
		removeListener,
	} = usePlayerStore();
	const { socket } = useChatStore();

	// handle play/pause logic
	useEffect(() => {
		if (isListeningAlong) return;
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause();
	}, [isPlaying, isListeningAlong]);

	// handle song ends
	useEffect(() => {
		if (isListeningAlong) return;
		const audio = audioRef.current;
		const handleEnded = () => playNext();
		audio?.addEventListener("ended", handleEnded);
		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext, isListeningAlong]);

	// handle song changes
	useEffect(() => {
		if (isListeningAlong || !audioRef.current || !currentSong) return;
		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong?.audioUrl;
			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying, isListeningAlong]);

	// --- Logic for the HOST to broadcast their state ---
	useEffect(() => {
		if (isListeningAlong || !currentSong || !socket) return;
		const audio = audioRef.current;
		if (!audio) return;

		const broadcastState = () => {
			socket.emit("player:state-update", {
				song: currentSong,
				isPlaying: !audio.paused,
				currentTime: audio.currentTime,
			});
		};

		const throttle = (func: () => void, delay: number) => {
			let timeoutId: NodeJS.Timeout | null = null;
			return () => {
				if (!timeoutId) {
					timeoutId = setTimeout(() => {
						func();
						timeoutId = null;
					}, delay);
				}
			};
		};

		const throttledBroadcast = throttle(broadcastState, 1000);

		audio.addEventListener("play", broadcastState);
		audio.addEventListener("pause", broadcastState);
		audio.addEventListener("timeupdate", throttledBroadcast);
		audio.addEventListener("ended", broadcastState);

		return () => {
			audio.removeEventListener("play", broadcastState);
			audio.removeEventListener("pause", broadcastState);
			audio.removeEventListener("timeupdate", throttledBroadcast);
			audio.removeEventListener("ended", broadcastState);
		};
	}, [isListeningAlong, currentSong, socket]);

	// --- Logic for the LISTENER and HOST to receive state ---
	useEffect(() => {
		if (!socket) return;

		const handleSync = (playerState: any) => {
			if (!audioRef.current) return;
			syncPlayerState(playerState);
			audioRef.current.src = playerState.song.audioUrl;
			audioRef.current.currentTime = playerState.currentTime;
			if (playerState.isPlaying) audioRef.current.play().catch(console.error);
			else audioRef.current.pause();
		};

		const handleUpdate = (playerState: any) => {
			if (!audioRef.current) return;
			const audio = audioRef.current;
			if (audio.src !== playerState.song.audioUrl) {
				syncPlayerState(playerState);
				audio.src = playerState.song.audioUrl;
			}
			if (Math.abs(audio.currentTime - playerState.currentTime) > 2) {
				audio.currentTime = playerState.currentTime;
			}
			if (playerState.isPlaying && audio.paused) audio.play().catch(console.error);
			else if (!playerState.isPlaying && !audio.paused) audio.pause();
		};

		const handleHostDisconnect = () => {
			toast.error(`${listenAlongHost?.name || "The host"} has disconnected.`);
			stopListeningAlong();
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = "";
			}
		};

		const handleRequestSync = ({ listenerId }: { listenerId: string }) => {
			if (audioRef.current && currentSong) {
				const playerState = {
					song: currentSong,
					isPlaying: !audioRef.current.paused,
					currentTime: audioRef.current.currentTime,
				};
				socket.emit("listen-along:sync-state", { listenerId, playerState });
			}
		};

		const handleListenerJoined = ({ listenerId }: { listenerId: string }) => {
			addListener(listenerId);
			toast.success("A new user is listening along!");
		};

		const handleListenerLeft = ({ listenerId }: { listenerId: string }) => {
			removeListener(listenerId);
			toast("A user has stopped listening along.");
		};

		socket.on("listen-along:sync", handleSync);
		socket.on("listen-along:update", handleUpdate);
		socket.on("listen-along:host-disconnected", handleHostDisconnect);
		socket.on("listen-along:request-sync", handleRequestSync);
		socket.on("listen-along:listener-joined", handleListenerJoined);
		socket.on("listen-along:listener-left", handleListenerLeft);

		return () => {
			socket.off("listen-along:sync", handleSync);
			socket.off("listen-along:update", handleUpdate);
			socket.off("listen-along:host-disconnected", handleHostDisconnect);
			socket.off("listen-along:request-sync", handleRequestSync);
			socket.off("listen-along:listener-joined", handleListenerJoined);
			socket.off("listen-along:listener-left", handleListenerLeft);
		};
	}, [socket, syncPlayerState, stopListeningAlong, listenAlongHost, currentSong, addListener, removeListener]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;
