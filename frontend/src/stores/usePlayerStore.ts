import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerState {
	song: Song;
	isPlaying: boolean;
	currentTime: number;
}
interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isListeningAlong: boolean;
	listenAlongHost: { id: string; name: string } | null;
	listeners: Set<string>;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	startListeningAlong: (host: { id: string; name: string }) => void;
	stopListeningAlong: () => void;
	syncPlayerState: (state: PlayerState) => void;
	addListener: (listenerId: string) => void;
	removeListener: (listenerId: string) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isListeningAlong: false,
	listenAlongHost: null,
	listeners: new Set(),

	initializeQueue: (songs: Song[]) => {
		if (get().isListeningAlong) return;
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (get().isListeningAlong || songs.length === 0) return;
		const song = songs[startIndex];
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (get().isListeningAlong || !song) return;
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		if (get().isListeningAlong) return;
		const willStartPlaying = !get().isPlaying;
		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}
		set({ isPlaying: willStartPlaying });
	},

	playNext: () => {
		if (get().isListeningAlong) return;
		const { currentIndex, queue } = get();
		const nextIndex = currentIndex + 1;
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];
			get().setCurrentSong(nextSong);
		} else {
			set({ isPlaying: false });
			const socket = useChatStore.getState().socket;
			if (socket?.auth) {
				socket.emit("update_activity", { userId: socket.auth.userId, activity: "Idle" });
			}
		}
	},

	playPrevious: () => {
		if (get().isListeningAlong) return;
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			get().setCurrentSong(prevSong);
		}
	},

	startListeningAlong: (host) => set({ isListeningAlong: true, listenAlongHost: host, listeners: new Set() }),
	stopListeningAlong: () => set({ isListeningAlong: false, listenAlongHost: null, isPlaying: false }),
	syncPlayerState: (state) => {
		set({
			currentSong: state.song,
			isPlaying: state.isPlaying,
		});
	},
	addListener: (listenerId: string) =>
		set((state) => ({ listeners: new Set(state.listeners).add(listenerId) })),
	removeListener: (listenerId: string) =>
		set((state) => {
			const newListeners = new Set(state.listeners);
			newListeners.delete(listenerId);
			return { listeners: newListeners };
		}),
}));
