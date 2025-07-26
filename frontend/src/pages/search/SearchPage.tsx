import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayButton from "../home/components/PlayButton";
import { Song } from "@/types";
import { usePlayerStore } from "@/stores/usePlayerStore";

const SearchPage = () => {
	const { songs, fetchSongs, isLoading } = useMusicStore();
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		// Fetch songs when the component mounts
		fetchSongs();
	}, [fetchSongs]);

	// Filter songs based on the search term, or show all if search is empty
	const filteredSongs = searchTerm
		? songs.filter(
				(song) =>
					song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					song.artist.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: songs;

	return (
		<main className='bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white h-screen overflow-hidden'>
			<Topbar />
			<div className='p-4 sm:p-6'>
				<Input
					type='text'
					placeholder='Search for songs or artists...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full max-w-lg mx-auto mb-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white border-zinc-700 placeholder:text-zinc-400 focus:outline-cyan-950 focus:ring-1 focus:ring-blue-500'
				/>
				<ScrollArea className='h-[calc(100vh-300px)] '>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 pr-4'>
						{isLoading && filteredSongs.length === 0 ? (
							<p>Loading songs...</p>
						) : (
							filteredSongs.map((song) => <SongItem key={song._id} song={song} />)
						)}
					</div>
				</ScrollArea>
			</div>
		</main>
	);
};

const SongItem = ({ song }: { song: Song }) => {
	const { setCurrentSong } = usePlayerStore();

	const handlePlay = () => {
		setCurrentSong(song);
	};

	return (
		<div
			onClick={handlePlay}
			className='bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 p-2 rounded-md hover:bg-gray-900/70 transition-all group flex items-center gap-3 sm:block sm:p-4 cursor-pointer backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg'
		>
			<div className='relative flex-shrink-0 h-16 w-16 sm:w-full sm:h-fit sm:aspect-square sm:mb-2 rounded-md overflow-hidden'>
				<img
					src={song.imageUrl}
					alt={song.title}
					className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
				/>
				<div className='hidden sm:block'>
					<PlayButton song={song} />
				</div>
			</div>
			<div className='flex-1 min-w-0'>
				<h3 className='font-medium truncate text-white'>{song.title}</h3>
				<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
			</div>
			<div className='sm:hidden'>
				<PlayButton song={song} className='!relative !opacity-100 !translate-y-0' />
			</div>
		</div>
	);
};

export default SearchPage; 