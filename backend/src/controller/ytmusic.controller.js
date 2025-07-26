import { searchYouTubeMusic, getSongDetails, getPlaylistDetails } from '../lib/ytmusic.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const searchYTMusic = async (req, res) => {
  try {
    const { q, type = 'songs' } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search for all types and let frontend filter
    const results = await searchYouTubeMusic(q);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search YouTube Music' });
  }
};

export const getYTMusicSong = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const song = await getSongDetails(videoId);
    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ message: 'Failed to get song details' });
  }
};

export const streamYTMusic = async (req, res) => {
  try {
    const { videoId } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Use yt-dlp to stream audio
    const ytdlp = exec(`yt-dlp -f bestaudio -o - "${url}"`, { 
      maxBuffer: 1024 * 1024 * 10 
    });
    
    ytdlp.stdout.pipe(res);
    
    ytdlp.stderr.on('data', (data) => {
      console.error('yt-dlp error:', data.toString());
    });
    
    ytdlp.on('error', (error) => {
      console.error('yt-dlp execution error:', error);
      res.status(500).json({ message: 'Failed to stream audio' });
    });
    
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ message: 'Failed to stream audio' });
  }
};

export const getAudioUrl = async (req, res) => {
  try {
    const { videoId } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Get the direct audio URL using yt-dlp
    const { stdout } = await execAsync(`yt-dlp -f bestaudio --get-url "${url}"`);
    const audioUrl = stdout.trim();
    
    res.json({ audioUrl });
  } catch (error) {
    console.error('Get audio URL error:', error);
    res.status(500).json({ message: 'Failed to get audio URL' });
  }
}; 

export const getAlbumTracks = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    if (!playlistId) {
      return res.status(400).json({ message: 'Playlist ID is required' });
    }

    const playlist = await getPlaylistDetails(playlistId);
    res.json(playlist);
  } catch (error) {
    console.error('Get album tracks error:', error);
    res.status(500).json({ message: 'Failed to get album tracks' });
  }
}; 