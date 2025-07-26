import express from 'express';
import {
  searchYTMusic,
  getYTMusicSong,
  streamYTMusic,
  getAudioUrl,
  getAlbumTracks,
  testYTDLP
} from '../controller/ytmusic.controller.js';

const router = express.Router();

router.get('/test', testYTDLP);
router.get('/search', searchYTMusic);
router.get('/song/:videoId', getYTMusicSong);
router.get('/stream', streamYTMusic);
router.get('/audio-url', getAudioUrl);
router.get('/album/:playlistId', getAlbumTracks);

export default router; 