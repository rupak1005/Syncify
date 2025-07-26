import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useChatStore } from "@/stores/useChatStore";
import { Radio, X, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Users, Maximize2, X as CloseIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const {
		currentSong,
		isPlaying,
		togglePlay,
		playNext,
		playPrevious,
		isListeningAlong,
		listenAlongHost,
		stopListeningAlong,
		listeners,
	} = usePlayerStore();
	const { socket } = useChatStore();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [showFullScreen, setShowFullScreen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		audioRef.current = document.querySelector("audio");
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			if (!isListeningAlong) {
				usePlayerStore.setState({ isPlaying: false });
			}
		};
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong, isListeningAlong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current && !isListeningAlong) {
			audioRef.current.currentTime = value[0];
		}
	};

	const handleStopListening = () => {
		if (listenAlongHost) {
			socket.emit("listen-along:stop", { hostUserId: listenAlongHost.id });
			stopListeningAlong();
			if (audioRef.current) {
				audioRef.current.pause();
			}
		}
	};

	return (
		<>
			<Dialog open={showFullScreen} onOpenChange={setShowFullScreen}>
				{/* Main player bar */}
				<footer className='h-28 sm:h-24 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 text-white border-1 border-gray-900 px-3 py-2 sm:px-4 sm:py-0 fixed bottom-0 left-0 w-full z-40 backdrop-blur-md backdrop-saturate-150 border-white/10 shadow-lg'>
					{isListeningAlong && listenAlongHost && (
						<div className='absolute -top-10 left-0 w-full bg-green-500 text-white text-center p-2 flex items-center justify-center gap-4'>
							<Radio className='size-5' />
							<span>Listening along with {listenAlongHost.name}</span>
							<button onClick={handleStopListening} className='font-bold' title='Stop listening along'>
								<X className='size-5' />
							</button>
						</div>
					)}
					{!isListeningAlong && listeners.size > 0 && (
						<div className='absolute -top-10 left-0 w-full bg-blue-500 text-white text-center p-2 flex items-center justify-center gap-4'>
							<Users className='size-5' />
							<span>{listeners.size} {listeners.size === 1 ? 'person' : 'people'} listening along</span>
						</div>
					)}
					<div className='flex flex-col sm:flex-row justify-between items-center h-full max-w-[1800px] mx-auto'>
						{/* Mobile: song info and controls in a row */}
						<div className='flex sm:hidden items-center gap-3 w-full'>
							{currentSong && (
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-12 h-12 object-cover rounded-md flex-shrink-0'
								/>
							)}
							<div className='flex-1 min-w-0'>
								{currentSong && (
									<div>
										<div className='font-medium truncate text-sm'>{currentSong.title}</div>
										<div className='text-xs text-zinc-400 truncate'>{currentSong.artist}</div>
									</div>
								)}
							</div>
							<div className='flex items-center gap-2'>
								<Button
									size='icon'
									variant='ghost'
									className='hover:text-white text-zinc-400'
									onClick={playPrevious}
									disabled={!currentSong || isListeningAlong}
								>
									<SkipBack className='h-5 w-5' />
								</Button>
								<Button
									size='icon'
									className='bg-blue-500 hover:bg-blue-400 text-black rounded-full h-10 w-10'
									onClick={togglePlay}
									disabled={!currentSong || isListeningAlong}
								>
									{isPlaying ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
								</Button>
								<Button
									size='icon'
									variant='ghost'
									className='hover:text-white text-zinc-400'
									onClick={playNext}
									disabled={!currentSong || isListeningAlong}
								>
									<SkipForward className='h-5 w-5' />
								</Button>
								{/* Full screen button for mobile */}
								<Button
									size='icon'
									variant='ghost'
									className='hover:text-white text-zinc-400 sm:hidden'
									onClick={() => navigate('/player/fullscreen')}
									disabled={!currentSong}
								>
									<Maximize2 className='h-5 w-5' />
								</Button>
							</div>
						</div>

						{/* Mobile: slider and volume controls */}
						<div className='flex sm:hidden items-center gap-2 w-full mt-2'>
							<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								className='w-full hover:cursor-grab active:cursor-grabbing'
								onValueChange={handleSeek}
								disabled={isListeningAlong}
							/>
							<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
						</div>

						{/* Desktop: original controls */}
						<div className='hidden sm:flex justify-between items-center h-full w-full '>
							{/* currently playing song */}
							<div className='flex items-center gap-4 min-w-[180px] w-[30%]'>
								{currentSong && (
									<>
										<img
											src={currentSong.imageUrl}
											alt={currentSong.title}
											className='w-14 h-14 object-cover rounded-md'
										/>
										<div className='flex-1 min-w-0'>
											<div className='font-medium truncate hover:underline cursor-pointer'>
												{currentSong.title}
											</div>
											<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
												{currentSong.artist}
											</div>
										</div>
									</>
								)}
							</div>

							{/* player controls*/}
							<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%] '>
								<div className='flex items-center gap-4 sm:gap-6'>
									<Button
										size='icon'
										variant='ghost'
										className='hidden sm:inline-flex hover:text-white text-zinc-400'
										disabled={isListeningAlong}
									>
										<Shuffle className='h-4 w-4' />
									</Button>

									<Button
										size='icon'
										variant='ghost'
										className='hover:text-white text-zinc-400'
										onClick={playPrevious}
										disabled={!currentSong || isListeningAlong}
									>
										<SkipBack className='h-4 w-4' />
									</Button>

									<Button
										size='icon'
										className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
										onClick={togglePlay}
										disabled={!currentSong || isListeningAlong}
									>
										{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
									</Button>
									<Button
										size='icon'
										variant='ghost'
										className='hover:text-white text-zinc-400'
										onClick={playNext}
										disabled={!currentSong || isListeningAlong}
									>
										<SkipForward className='h-4 w-4' />
									</Button>
									<Button
										size='icon'
										variant='ghost'
										className='hidden sm:inline-flex hover:text-white text-zinc-400'
										disabled={isListeningAlong}
									>
										<Repeat className='h-4 w-4' />
									</Button>
								</div>

								<div className='hidden sm:flex items-center gap-2 w-full'>
									<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
									<Slider
										value={[currentTime]}
										max={duration || 100}
										step={1}
										className='w-full hover:cursor-grab active:cursor-grabbing'
										onValueChange={handleSeek}
										disabled={isListeningAlong}
									/>
									<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
								</div>
							</div>
							{/* volume controls */}
							<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
								<div className='flex items-center gap-2'>
									<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
										<Volume1 className='h-4 w-4' />
									</Button>
									<Slider
										value={[volume]}
										max={100}
										step={1}
										className='w-24 hover:cursor-grab active:cursor-grabbing'
										onValueChange={(value) => {
											setVolume(value[0]);
											if (audioRef.current) {
												audioRef.current.volume = value[0] / 100;
											}
										}}
									/>
								</div>
							</div>
						</div>
						{/* Full screen button (desktop only) */}
						<div className="hidden sm:flex items-center gap-2 ml-4">
							<Button size="icon" variant="ghost" className="hover:text-white text-zinc-400" onClick={() => navigate('/player/fullscreen')}>
								<Maximize2 className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</footer>
				{/* Full Screen Dialog Content */}
				<DialogContent className="p-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white max-w-3xl w-full h-[90vh] flex flex-col items-center justify-center relative">
					<button
						className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800"
						onClick={() => setShowFullScreen(false)}
						aria-label="Close full screen player"
					>
						<CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
					</button>
					{currentSong && (
						<div className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-8">
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className="w-40 h-40 sm:w-64 sm:h-64 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl mb-6 sm:mb-8"
							/>
							<div className="text-center mb-4 sm:mb-6">
								<div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{currentSong.title}</div>
								<div className="text-base sm:text-xl text-zinc-300">{currentSong.artist}</div>
							</div>
							<div className="flex flex-col items-center w-full max-w-xs sm:max-w-xl">
								<div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-4">
									<Button
										size='icon'
										variant='ghost'
										className='hover:text-white text-zinc-400'
										onClick={playPrevious}
										disabled={!currentSong || isListeningAlong}
									>
										<SkipBack className='h-6 w-6 sm:h-8 sm:w-8' />
									</Button>
									<Button
										size='icon'
										className='bg-white hover:bg-white/80 text-black rounded-full h-12 w-12 sm:h-16 sm:w-16'
										onClick={togglePlay}
										disabled={!currentSong || isListeningAlong}
									>
										{isPlaying ? <Pause className='h-8 w-8 sm:h-12 sm:w-12' /> : <Play className='h-8 w-8 sm:h-12 sm:w-12' />}
									</Button>
									<Button
										size='icon'
										variant='ghost'
										className='hover:text-white text-zinc-400'
										onClick={playNext}
										disabled={!currentSong || isListeningAlong}
									>
										<SkipForward className='h-6 w-6 sm:h-8 sm:w-8' />
									</Button>
								</div>
								<div className='flex items-center gap-1 sm:gap-2 w-full'>
									<div className='text-xs sm:text-lg text-zinc-400'>{formatTime(currentTime)}</div>
									<Slider
										value={[currentTime]}
										max={duration || 100}
										step={1}
										className='w-full hover:cursor-grab active:cursor-grabbing'
										onValueChange={handleSeek}
										disabled={isListeningAlong}
									/>
									<div className='text-xs sm:text-lg text-zinc-400'>{formatTime(duration)}</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};
