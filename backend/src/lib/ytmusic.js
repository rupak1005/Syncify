import YTMusic from 'ytmusic-api';

let ytmusic = null;

// Initialize the YouTube Music API
export async function initializeYTMusic() {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
  }
  return ytmusic;
}

// Search YouTube Music for songs, artists, albums, etc.
export async function searchYouTubeMusic(query, type = 'songs') {
  try {
    const yt = await initializeYTMusic();
    const results = await yt.search(query, type);
    return results;
  } catch (error) {
    console.error('Error searching YouTube Music:', error);
    throw new Error('Failed to search YouTube Music');
  }
}

// Get song details by video ID
export async function getSongDetails(videoId) {
  try {
    const yt = await initializeYTMusic();
    const song = await yt.getSong(videoId);
    return song;
  } catch (error) {
    console.error('Error getting song details:', error);
    throw new Error('Failed to get song details');
  }
}

// Get playlist details
export async function getPlaylistDetails(playlistId) {
  try {
    const yt = await initializeYTMusic();
    const playlist = await yt.getPlaylist(playlistId);
    return playlist;
  } catch (error) {
    console.error('Error getting playlist details:', error);
    throw new Error('Failed to get playlist details');
  }
} 