import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Connected to MongoDB ${conn.connection.host}`);
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error.message);
		if (error.name === 'MongooseServerSelectionError') {
			console.error("Could not connect to any MongoDB server. Check if your IP is whitelisted or if the URI is correct.");
		}
		process.exit(1);
	}
};
