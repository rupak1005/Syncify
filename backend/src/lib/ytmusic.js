import YTMusic from 'ytmusic-api';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let ytmusic = null;

// Initialize the YouTube Music API
export async function initializeYTMusic() {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
  }
  return ytmusic;
}

// Fallback search using yt-dlp
async function searchWithYTDlp(query, limit = 10) {
  try {
    console.log(`Using yt-dlp fallback search for: ${query}`);
    // ytsearch provides standard YouTube search results
    const command = `yt-dlp "ytsearch${limit}:${query}" --dump-json --no-playlist --no-warnings`;
    const { stdout } = await execAsync(command);

    if (!stdout.trim()) return [];

    // yt-dlp returns multiple JSON objects (one per line)
    const results = stdout.trim().split('\n').map(line => {
      const data = JSON.parse(line);
      return {
        type: 'VIDEO',
        videoId: data.id,
        name: data.title,
        artist: {
          name: data.uploader || data.channel || 'Unknown Artist',
          artistId: data.channel_id || ''
        },
        duration: data.duration || 0,
        thumbnails: [{
          url: data.thumbnail || (data.thumbnails && data.thumbnails[0]?.url) || '/logo.png',
          width: 0,
          height: 0
        }]
      };
    });

    return results;
  } catch (error) {
    console.error('yt-dlp search fallback failed:', error);
    return [];
  }
}

// Search YouTube Music for songs, artists, albums, etc.
export async function searchYouTubeMusic(query, type = 'songs') {
  try {
    const yt = await initializeYTMusic();
    const results = await yt.search(query, type);
    return results;
  } catch (error) {
    // console.error('Error searching YouTube Music with ytmusic-api:', error.message);

    // Fallback to yt-dlp if it's a song search (or any search if ytmusic-api fails)
    // Note: yt-dlp search is general, so we mostly use it for songs
    if (type === 'songs' || type === 'videos' || !type) {
      return await searchWithYTDlp(query);
    }

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