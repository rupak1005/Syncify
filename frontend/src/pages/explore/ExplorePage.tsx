import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Pause, Loader2, Music, Users, Disc3 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface YTSong {
  type: string;
  videoId: string;
  name: string;
  artist: { artistId: string; name: string };
  duration: number;
  thumbnails?: Array<{ url: string; width: number; height: number }>;
}

interface YTAlbum {
  type: string;
  albumId: string;
  name: string;
  artist: { artistId: string; name: string };
  year?: number;
  thumbnails?: Array<{ url: string; width: number; height: number }>;
  playlistId?: string; // Added for album playback
}

interface YTArtist {
  type: string;
  artistId: string;
  name: string;
  thumbnails?: Array<{ url: string; width: number; height: number }>;
}

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"songs" | "albums" | "artists">("songs");
  const [songs, setSongs] = useState<YTSong[]>([]);
  const [albums, setAlbums] = useState<YTAlbum[]>([]);
  const [artists, setArtists] = useState<YTArtist[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingAlbum, setLoadingAlbum] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showHistory, setShowHistory] = useState(true);
  const [displayedSongsCount, setDisplayedSongsCount] = useState(4);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { currentSong, isPlaying, setCurrentSong, queue, initializeQueue} = usePlayerStore();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ytmusic-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('ytmusic-recent-searches', JSON.stringify(updated));
  };

  // Search suggestions
  const searchSuggestions = [
    "Despacito", "Shape of You", "Blinding Lights", "Dance Monkey", "Uptown Funk",
    "Happy", "See You Again", "Sugar", "Counting Stars", "All of Me",
    "Radioactive", "Demons", "Stay With Me", "Shake It Off", "Blank Space"
  ];

  // Trending searches and popular artists
  const trendingSearches = [
    "Ed Sheeran", "Taylor Swift", "Drake", "Ariana Grande", "The Weeknd",
    "Billie Eilish", "Post Malone", "Dua Lipa", "Justin Bieber", "BTS"
  ];

  const popularGenres = [
    "Pop", "Hip Hop", "Rock", "Electronic", "R&B", "Country", "Latin", "K-Pop"
  ];

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    setShowHistory(value.trim().length === 0);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Show suggestions based on input
    if (value.trim()) {
      const filtered = searchSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Auto-search after 1 second of no typing
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchYTMusic();
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    searchYTMusic();
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search);
    searchYTMusic();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('ytmusic-recent-searches');
  };

  const handleViewMore = () => {
    setDisplayedSongsCount(prev => prev + 4);
  };

  const handleViewLess = () => {
    setDisplayedSongsCount(4);
  };

  const searchYTMusic = async (isRetry = false) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError(null);
    if (!isRetry) {
      saveRecentSearch(searchTerm.trim());
      setRetryCount(0);
      setDisplayedSongsCount(4); // Reset to show only 4 songs initially
    }
    try {
      const response = await axiosInstance.get(`/ytmusic/search?q=${encodeURIComponent(searchTerm)}&type=${activeTab}`);
      const results = response.data || [];
      
      if (activeTab === "songs") {
        // Filter only VIDEO type results for songs
        const songs = results.filter((item: any) => item.type === "VIDEO");
        setSongs(songs);
        setAlbums([]);
        setArtists([]);
      } else if (activeTab === "albums") {
        // Filter only ALBUM type results
        const albums = results.filter((item: any) => item.type === "ALBUM");
        setAlbums(albums);
        setSongs([]);
        setArtists([]);
      } else if (activeTab === "artists") {
        // Filter only ARTIST type results
        const artists = results.filter((item: any) => item.type === "ARTIST");
        setArtists(artists);
        setSongs([]);
        setAlbums([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage = retryCount < 2 
        ? "Search failed. Tap to retry." 
        : "Failed to search YouTube Music. Please try again later.";
      setError(errorMessage);
      setSongs([]); setAlbums([]); setArtists([]);
      if (!isRetry) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      searchYTMusic(true);
    }
  };

  const handlePlaySong = async (song: YTSong) => {
    try {
      setCurrentPlayingId(song.videoId);
      // Get audio URL from backend
      const response = await axiosInstance.get(`/ytmusic/audio-url?videoId=${song.videoId}`);
      const audioUrl = response.data.audioUrl;
      // Create a song object compatible with your player store
      const songData = {
        _id: song.videoId,
        title: song.name,
        artist: song.artist.name,
        albumId: null,
        imageUrl: song.thumbnails?.[0]?.url || "/logo.png",
        audioUrl: audioUrl,
        duration: song.duration || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // Add to queue if not present
      if (!queue.some((s) => s._id === songData._id)) {
        initializeQueue([songData]);
      }
      setCurrentSong(songData);
      toast.success(`Now playing: ${song.name}`);
    } catch (error) {
      console.error("Play error:", error);
      toast.error("Failed to play song");
    } finally {
      setCurrentPlayingId(null);
    }
  };

  const handlePlayAlbum = async (album: YTAlbum) => {
    if (!album.playlistId) {
      toast.error("Album tracks not available");
      return;
    }

    try {
      setLoadingAlbum(album.albumId);
      
      // Get album tracks from backend
      const response = await axiosInstance.get(`/ytmusic/album/${album.playlistId}`);
      const tracks = response.data.tracks || [];
      
      if (tracks.length === 0) {
        toast.error("No tracks found for this album");
        return;
      }

      // Convert tracks to song format and add to queue
      const songs = tracks.map((track: any) => ({
        _id: track.videoId,
        title: track.name,
        artist: track.artist?.name || album.artist.name,
        albumId: null,
        imageUrl: track.thumbnails?.[0]?.url || album.thumbnails?.[0]?.url || "/logo.png",
        audioUrl: "", // Will be fetched when played
        duration: track.duration || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Initialize queue with album tracks
      initializeQueue(songs);
      
      // Play first track
      if (songs.length > 0) {
        const firstSong = songs[0];
        // Get audio URL for first song
        const audioResponse = await axiosInstance.get(`/ytmusic/audio-url?videoId=${firstSong._id}`);
        const updatedSong = { ...firstSong, audioUrl: audioResponse.data.audioUrl };
        setCurrentSong(updatedSong);
        toast.success(`Now playing: ${album.name} - ${firstSong.title}`);
      }
    } catch (error) {
      console.error("Play album error:", error);
      toast.error("Failed to play album");
    } finally {
      setLoadingAlbum(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      searchYTMusic();
    }
  };

  const getThumbnailUrl = (thumbnails?: Array<{ url: string; width: number; height: number }>) => {
    if (!thumbnails || thumbnails.length === 0) return "/logo.png";
    return thumbnails[0].url;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="rounded-lg bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 text-white p-2 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg">
      <ScrollArea className="h-[calc(100vh-120px)] pb-20">
        <div className="p-4 sm:p-6">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-base font-semibold mr-2 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg">Explore</span>
                  YouTube Music
                </h1>
                <p className="text-zinc-400">Discover and play music from YouTube Music</p>
              </div>
              <Link to="/" className="ml-4 px-4 py-2 rounded bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 text-white font-semibold transition-all duration-300">Back</Link>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for songs, albums, or artists..."
                    value={searchTerm}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 border-white/10 text-white placeholder:text-zinc-400 backdrop-blur-md backdrop-saturate-150 shadow-lg focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-gradient-to-br from-gray-900/80 via-gray-950/80 to-black/80 border border-white/10 rounded-b-lg z-50 max-h-60 overflow-y-auto backdrop-blur-md backdrop-saturate-150 shadow-xl">
                      {suggestions.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs text-zinc-400 px-2 py-1">Suggestions</div>
                          {suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-2 py-2 hover:bg-white/5 rounded text-sm transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {recentSearches.length > 0 && (
                        <div className="p-2 border-t border-white/10">
                          <div className="flex items-center justify-between px-2 py-1">
                            <div className="text-xs text-zinc-400">Recent searches</div>
                            <button
                              onClick={clearRecentSearches}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Clear
                            </button>
                          </div>
                          {recentSearches.slice(0, 5).map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleRecentSearchClick(search)}
                              className="w-full text-left px-2 py-2 hover:bg-white/5 rounded text-sm transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => searchYTMusic()} 
                  disabled={isLoading || !searchTerm.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === "songs" ? "default" : "outline"}
                onClick={() => setActiveTab("songs")}
                className={`flex items-center gap-2 ${
                  activeTab === "songs" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg" 
                    : "bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60"
                } transition-all duration-300`}
              >
                <Music className="h-4 w-4" />
                Songs
              </Button>
              <Button
                variant={activeTab === "albums" ? "default" : "outline"}
                onClick={() => setActiveTab("albums")}
                className={`flex items-center gap-2 ${
                  activeTab === "albums" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg" 
                    : "bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60"
                } transition-all duration-300`}
              >
                <Disc3 className="h-4 w-4" />
                Albums
              </Button>
              <Button
                variant={activeTab === "artists" ? "default" : "outline"}
                onClick={() => setActiveTab("artists")}
                className={`flex items-center gap-2 ${
                  activeTab === "artists" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg" 
                    : "bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60"
                } transition-all duration-300`}
              >
                <Users className="h-4 w-4" />
                Artists
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {error && (
                <div className="text-center py-8">
                  <div className="text-red-400 font-semibold mb-4">{error}</div>
                  {retryCount < 3 && (
                    <Button 
                      onClick={handleRetry}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg transition-all duration-300"
                    >
                      Retry Search
                    </Button>
                  )}
                </div>
              )}
              {isLoading && (
                <div>
                  {activeTab === "songs" && (
                    <div className="grid gap-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg">
                          <Skeleton className="w-16 h-16 rounded" />
                          <div className="flex-1 min-w-0">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "albums" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg p-4 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg">
                          <Skeleton className="w-full aspect-square rounded mb-3" />
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "artists" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg p-4 text-center backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg">
                          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-3" />
                          <Skeleton className="h-5 w-24 mx-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!isLoading && !error && searchTerm && songs.length === 0 && albums.length === 0 && artists.length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  No results found for "{searchTerm}". Try a different search or check your spelling.
                </div>
              )}

              {!isLoading && !error && !searchTerm && showHistory && (
                <div className="space-y-8">
                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Trending Artists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {trendingSearches.map((artist, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchTerm(artist);
                            setActiveTab("artists");
                            searchYTMusic();
                          }}
                          className="p-3 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg text-center"
                        >
                          <div className="text-sm font-medium truncate">{artist}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Genres */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Popular Genres</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {popularGenres.map((genre, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchTerm(genre);
                            setActiveTab("songs");
                            searchYTMusic();
                          }}
                          className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-500/30 backdrop-blur-md backdrop-saturate-150 shadow-lg"
                        >
                          <div className="text-sm font-semibold">{genre}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Recent Searches</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {recentSearches.slice(0, 6).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="p-3 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg text-left"
                          >
                            <div className="text-sm font-medium truncate">{search}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "songs" && songs.length > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {songs.slice(0, displayedSongsCount).map((song) => (
                      <div
                        key={song.videoId}
                        className={`flex items-center gap-4 p-4 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg ${
                          currentSong?._id === song.videoId ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={getThumbnailUrl(song.thumbnails)}
                          alt={song.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{song.name}</h3>
                          <p className="text-zinc-400 text-sm truncate">{song.artist.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 text-sm">{formatDuration(song.duration)}</span>
                          <Button
                            size="sm"
                            onClick={() => handlePlaySong(song)}
                            disabled={currentPlayingId === song.videoId}
                            className={`${
                              currentSong?._id === song.videoId 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            } backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg transition-all duration-300`}
                          >
                            {currentPlayingId === song.videoId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : currentSong?._id === song.videoId ? (
                              isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View More/Less Buttons */}
                  {songs.length > 4 && (
                    <div className="flex justify-center pt-4">
                      {displayedSongsCount < songs.length ? (
                        <Button
                          onClick={handleViewMore}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg transition-all duration-300"
                        >
                          View More ({songs.length - displayedSongsCount} more)
                        </Button>
                      ) : (
                        <Button
                          onClick={handleViewLess}
                          variant="outline"
                          className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300"
                        >
                          View Less
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "albums" && albums.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albums.map((album) => (
                    <div
                      key={album.albumId}
                      className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg p-4 hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg"
                    >
                      <img
                        src={getThumbnailUrl(album.thumbnails)}
                        alt={album.name}
                        className="w-full aspect-square object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold truncate">{album.name}</h3>
                      <p className="text-zinc-400 text-sm truncate">{album.artist.name}</p>
                      {album.year && (
                        <p className="text-zinc-500 text-xs">{album.year}</p>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handlePlayAlbum(album)}
                        disabled={loadingAlbum === album.albumId}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg transition-all duration-300"
                      >
                        {loadingAlbum === album.albumId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        Play Album
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "artists" && artists.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artists.map((artist) => (
                    <div
                      key={artist.artistId}
                      className="bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg p-4 hover:from-gray-800/60 hover:via-gray-900/60 hover:to-black/60 transition-all duration-300 backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg text-center"
                    >
                      <img
                        src={getThumbnailUrl(artist.thumbnails)}
                        alt={artist.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                      />
                      <h3 className="font-semibold truncate">{artist.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default ExplorePage; 