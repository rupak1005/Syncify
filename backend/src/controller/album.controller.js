import { Album } from "../models/album.model.js";

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find().lean();
		res.set('Cache-Control', 'public, max-age=300'); // 5 min cache
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		const album = await Album.findById(albumId).populate("songs").lean();

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.set('Cache-Control', 'public, max-age=600'); // 10 min cache
		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
