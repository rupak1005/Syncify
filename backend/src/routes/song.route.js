import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getHomeSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";

const router = Router();

router.get("/", getAllSongs);

router.get("/home", getHomeSongs);
router.get("/featured", getFeaturedSongs);
router.get("/trending", getTrendingSongs);
router.get("/made-for-you", getMadeForYouSongs);

export default router;
