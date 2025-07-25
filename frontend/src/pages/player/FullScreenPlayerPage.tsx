import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play, SkipBack, SkipForward, ArrowLeft, Volume1, Sparkles, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import SplashCursor from "@/components/ui/splash-cursor";
import { WavyBackground } from "./WavyBackground";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const FullScreenPlayerPage = () => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    playNext,
    playPrevious,
    togglePlay,
    isListeningAlong,
  } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showSplashCursor, setShowSplashCursor] = useState(false);
  const [showWavyBackground, setShowWavyBackground] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const updateVolume = () => setVolume(Math.round(audio.volume * 100));
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("volumechange", updateVolume);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("volumechange", updateVolume);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && !isListeningAlong) {
      audioRef.current.currentTime = value[0];
    }
  };

  const handleVolume = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  return (
    <>
      {showWavyBackground && <div className="fixed inset-0 z-0 pointer-events-none"><WavyBackground /></div>}
      {showSplashCursor && <SplashCursor />}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        <ArrowLeft className="w-7 h-7" />
      </button>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        <button
          className="p-2 rounded-full bg-blue-600/80 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg mb-1"
          onClick={() => setShowSplashCursor((v) => !v)}
          aria-label="Toggle Splash Cursor"
        >
          <Sparkles className="w-6 h-6" />
          {showSplashCursor ? "Hide Cursor" : "Show Cursor"}
        </button>
        <button
          className="p-2 rounded-full bg-purple-600/80 hover:bg-purple-700 text-white flex items-center gap-2 shadow-lg"
          onClick={() => setShowWavyBackground((v) => !v)}
          aria-label="Toggle Wavy Background"
        >
          <Waves className="w-6 h-6" />
          {showWavyBackground ? "Hide Waves" : "Show Waves"}
        </button>
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        {currentSong && (
          <div className="flex flex-col items-center justify-center w-full h-full p-8">
            <img
              src={currentSong?.imageUrl}
              alt={currentSong?.title}
              className="w-36 h-36 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-2xl mb-8 border-4 border-blue-500/30"
            />
            <div className="text-center mb-8">
              <div className="text-3xl font-extrabold mb-2 drop-shadow-lg text-white">{currentSong?.title}</div>
              <div className="text-xl text-zinc-300 font-medium drop-shadow">{currentSong?.artist}</div>
            </div>
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="flex items-center gap-10 mb-8">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:text-white text-zinc-400"
                  onClick={playPrevious}
                  disabled={!currentSong || isListeningAlong}
                >
                  <SkipBack className="h-10 w-10 text-blue-400" />
                </Button>
                <Button
                  size="icon"
                  className="bg-white hover:bg-white/80 text-black rounded-full h-20 w-20"
                  onClick={togglePlay}
                  disabled={!currentSong || isListeningAlong}
                >
                  {isPlaying ? <Pause className="h-14 w-14" /> : <Play className="h-14 w-14" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:text-white text-zinc-400"
                  onClick={playNext}
                  disabled={!currentSong || isListeningAlong}
                >
                  <SkipForward className="h-10 w-10 text-blue-400" />
                </Button>
              </div>
              <div className="flex items-center gap-4 w-full mb-6">
                <span className="text-lg text-zinc-300 font-mono min-w-[60px] text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  className="w-full hover:cursor-grab active:cursor-grabbing"
                  onValueChange={handleSeek}
                  disabled={isListeningAlong}
                />
                <span className="text-lg text-zinc-300 font-mono min-w-[60px] text-left">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-4 w-full max-w-xs justify-center">
                <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
                  <Volume1 className="h-6 w-6" />
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-32 hover:cursor-grab active:cursor-grabbing"
                  onValueChange={handleVolume}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FullScreenPlayerPage; 