import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 50;
		const skip = (page - 1) * limit;

		const [songs, total] = await Promise.all([
			Song.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
			Song.countDocuments(),
		]);

		res.set('Cache-Control', 'public, max-age=60'); // 1 min cache
		res.json({ songs, total, page, totalPages: Math.ceil(total / limit) });
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.set('Cache-Control', 'public, max-age=300'); // 5 min cache
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.set('Cache-Control', 'public, max-age=300');
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// Batched endpoint: returns featured, madeForYou, and trending in a single response
export const getHomeSongs = async (req, res, next) => {
	try {
		const [featured, madeForYou, trending] = await Promise.all([
			Song.aggregate([
				{ $sample: { size: 6 } },
				{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
			]),
			Song.aggregate([
				{ $sample: { size: 4 } },
				{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
			]),
			Song.aggregate([
				{ $sample: { size: 4 } },
				{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
			]),
		]);

		res.set('Cache-Control', 'public, max-age=300');
		res.json({ featured, madeForYou, trending });
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.set('Cache-Control', 'public, max-age=300');
		res.json(songs);
	} catch (error) {
		next(error);
	}
};
