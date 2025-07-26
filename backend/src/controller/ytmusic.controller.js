import { searchYouTubeMusic, getSongDetails, getPlaylistDetails } from '../lib/ytmusic.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test endpoint to verify yt-dlp is working
export const testYTDLP = async (req, res) => {
  try {
    console.log('Testing yt-dlp availability...');
    const { stdout } = await execAsync('yt-dlp --version');
    console.log('yt-dlp version:', stdout.trim());
    
    // Test with a simple video
    const testVideoId = 'dQw4w9WgXcQ'; // Rick Roll
    const testUrl = `https://www.youtube.com/watch?v=${testVideoId}`;
    const testCommand = `yt-dlp -f bestaudio --get-url --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" --no-warnings "${testUrl}"`;
    
    console.log('Testing yt-dlp with test video...');
    const { stdout: audioUrl } = await execAsync(testCommand);
    
    res.json({ 
      success: true, 
      ytdlpVersion: stdout.trim(),
      testAudioUrl: audioUrl.trim(),
      message: 'yt-dlp is working correctly'
    });
  } catch (error) {
    console.error('yt-dlp test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stderr: error.stderr,
      message: 'yt-dlp test failed'
    });
  }
};

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
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

export const getYTMusicSong = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }
    
    const songDetails = await getSongDetails(videoId);
    res.json(songDetails);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ message: 'Failed to get song details', error: error.message });
  }
};

export const streamYTMusic = async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }
    
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Stream the audio directly
    const ytDlpCommand = `yt-dlp -f bestaudio --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --no-warnings -o - "${url}"`;
    
    const child = exec(ytDlpCommand);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    child.stdout.pipe(res);
    
    child.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString());
    });
    
    child.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).end();
    });
    
    req.on('close', () => {
      child.kill();
    });
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ message: 'Failed to stream audio', error: error.message });
  }
};

export const getAudioUrl = async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Try multiple approaches with different options
    const approaches = [
      // Approach 1: Standard with user-agent
      `yt-dlp -f bestaudio --get-url --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --no-warnings "${url}"`,
      
      // Approach 2: With no-check-certificates
      `yt-dlp -f bestaudio --get-url --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --no-warnings --no-check-certificates "${url}"`,
      
      // Approach 3: Different format
      `yt-dlp -f "bestaudio[ext=m4a]" --get-url --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --no-warnings "${url}"`,
      
      // Approach 4: With referer
      `yt-dlp -f bestaudio --get-url --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" --referer "https://www.youtube.com/" --no-warnings "${url}"`
    ];
    
    let lastError;
    
    for (let i = 0; i < approaches.length; i++) {
      try {
        console.log(`Trying approach ${i + 1} for video ${videoId}...`);
        const { stdout } = await execAsync(approaches[i]);
        const audioUrl = stdout.trim();
        
        if (audioUrl && audioUrl.startsWith('http')) {
          console.log(`Success with approach ${i + 1} for video ${videoId}`);
          return res.json({ audioUrl });
        } else {
          console.log(`Approach ${i + 1} returned invalid URL:`, audioUrl);
        }
      } catch (error) {
        lastError = error;
        console.error(`Approach ${i + 1} failed for video ${videoId}:`, error.message);
        
        // If it's a rate limit or bot verification, don't try other approaches
        if (error.stderr && (error.stderr.includes('429') || error.stderr.includes('Sign in to confirm'))) {
          console.log('Rate limit or bot verification detected, stopping attempts');
          break;
        }
        
        // Wait a bit before trying the next approach
        if (i < approaches.length - 1) {
          console.log('Waiting 2 seconds before next attempt...');
          await sleep(2000);
        }
      }
    }
    
    // If we get here, all approaches failed
    console.error('All approaches failed for video', videoId, ':', lastError);
    
    // Check if it's a rate limit error
    if (lastError && lastError.stderr && lastError.stderr.includes('429')) {
      return res.status(429).json({ 
        message: 'YouTube rate limit reached. Please try again in a few minutes.',
        error: 'RATE_LIMIT'
      });
    }
    
    // Check if it's a bot verification error
    if (lastError && lastError.stderr && lastError.stderr.includes('Sign in to confirm')) {
      return res.status(403).json({ 
        message: 'YouTube requires verification. Please try again later.',
        error: 'BOT_VERIFICATION'
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      message: 'Failed to get audio URL. Please try again.',
      error: 'AUDIO_URL_ERROR',
      details: lastError ? lastError.message : 'Unknown error'
    });
  } catch (error) {
    console.error('Get audio URL error for video', req.query.videoId, ':', error);
    res.status(500).json({ 
      message: 'Failed to get audio URL',
      error: 'AUDIO_URL_ERROR',
      details: error.message
    });
  }
};

export const getAlbumTracks = async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) {
      return res.status(400).json({ message: 'Playlist ID is required' });
    }
    
    const albumDetails = await getPlaylistDetails(playlistId);
    res.json(albumDetails);
  } catch (error) {
    console.error('Get album tracks error:', error);
    res.status(500).json({ message: 'Failed to get album tracks', error: error.message });
  }
}; 