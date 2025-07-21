import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const PlayButton = ({ song, className }: { song: Song; className?: string }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent click from bubbling up to the parent div
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={cn(
				`absolute bottom-3 right-2 bg-blue-500 hover:bg-blue-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 rounded-full`,
				isCurrentSong ? "opacity-100" : "group-hover:opacity-100",
				className
			)}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
		</Button>
	);
};

export default PlayButton;
