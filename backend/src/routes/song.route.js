import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";

const router = Router();

router.get("/", getAllSongs);

router.get("/featured", getFeaturedSongs);
router.get("/trending", getTrendingSongs);
router.get("/made-for-you", getMadeForYouSongs);

export default router;
