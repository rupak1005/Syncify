import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
	const { isLoading, featuredSongs, error } = useMusicStore();

	if (isLoading) return <FeaturedGridSkeleton />;

	if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 '>
			{featuredSongs.map((song) => (
				<div
					key={song._id}
					className='flex items-center bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-md overflow-hidden hover:bg-gray-900/70 transition-colors group cursor-pointer relative backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg'
				>
					<img
						src={song.imageUrl}
						alt={song.title}
						className='w-16  sm:w-20 h-fit  sm:h-20 object-cover m-2 rounded-sm'
					/>
					<div className='flex-1 p-4 '>
						<p className='font-medium truncate'>{song.title}</p>
						<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
					</div>
					<PlayButton song={song} />
				</div>
			))}
		</div>
	);
};
export default FeaturedSection;
