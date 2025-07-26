import express from 'express';
import { 
  searchYTMusic, 
  getYTMusicSong, 
  streamYTMusic, 
  getAudioUrl,
  getAlbumTracks
} from '../controller/ytmusic.controller.js';

const router = express.Router();

// Search YouTube Music
router.get('/search', searchYTMusic);

// Get song details by video ID
router.get('/song/:videoId', getYTMusicSong);

// Stream audio (server-side proxy)
router.get('/stream', streamYTMusic);

// Get direct audio URL
router.get('/audio-url', getAudioUrl);

// Get album tracks/playlist
router.get('/album/:playlistId', getAlbumTracks);

export default router; 