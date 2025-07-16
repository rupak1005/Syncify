import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";
import {connectDB} from "./libs/db.js";
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
console.log("Loaded PORT:", process.env.PORT);
const __dirname = path.resolve();
app.use(express.json());
app.use(clerkMiddleware()) //this middleware will handle Clerk authentication
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB  max file size
		},
	})
);
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});
