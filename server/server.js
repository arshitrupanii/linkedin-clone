// DEV TASK
// test connection api and global error handling

import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js"
import connectionsRoutes from "./routes/connections.routes.js"

import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan(process.env.LOGGER_INFO));
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }
));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, try again later",
        });
    },
});

const errorHandler = (err, req, res, next) => {
    console.error(`❌ ${req.method} ${req.originalUrl}`, err.stack);

    const statusCode = err.statusCode || 500;
    let message = err.message;

    if (process.env.NODE_ENV === "production" && statusCode === 500) {
        message = "Something went wrong";
    }

    res.status(statusCode).json({ success: false, message });
};

app.use(limiter);


// all api is tested 
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/connections", connectionsRoutes)

// global handler
app.use(errorHandler);


try {
    app.listen(PORT, () => {
        console.log(`server running on.. ${PORT}`);
    })
    connectDB();

} catch (error) {
    console.log("Error in server start : " + error);
    process.exit(1);
}