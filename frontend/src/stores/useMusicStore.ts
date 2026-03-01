import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	isFetchingAlbums: boolean;
	isFetchingAlbum: boolean;
	isFetchingFeaturedSongs: boolean;
	isFetchingMadeForYou: boolean;
	isFetchingTrending: boolean;
	isFetchingSongs: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchHomeSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	isFetchingAlbums: false,
	isFetchingAlbum: false,
	isFetchingFeaturedSongs: false,
	isFetchingMadeForYou: false,
	isFetchingTrending: false,
	isFetchingSongs: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isFetchingSongs: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data.songs || response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isFetchingSongs: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isFetchingAlbums: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchingAlbums: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isFetchingAlbum: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchingAlbum: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isFetchingFeaturedSongs: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchingFeaturedSongs: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isFetchingMadeForYou: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchingMadeForYou: false });
		}
	},

	// Batched fetch: gets all home page songs in a single API call
	fetchHomeSongs: async () => {
		set({ isFetchingFeaturedSongs: true, isFetchingMadeForYou: true, isFetchingTrending: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/home");
			set({
				featuredSongs: response.data.featured,
				madeForYouSongs: response.data.madeForYou,
				trendingSongs: response.data.trending,
			});
		} catch (error: any) {
			set({ error: error.response?.data?.message || error.message });
		} finally {
			set({ isFetchingFeaturedSongs: false, isFetchingMadeForYou: false, isFetchingTrending: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isFetchingTrending: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchingTrending: false });
		}
	},
}));
