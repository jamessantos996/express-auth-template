import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import errorhandler from "errorhandler";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import { protect } from "./middleware/authMiddleware";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Define the type of user property as any or replace with your specific user type
        }
    }
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// if (process.env.NODE_ENV === "development") {
//     // only use in development
//     app.use(errorhandler());
// }

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});
app.use("/auth", authRoutes);
app.get("/users", protect, (req, res) => {
    res.json({ user: req.user });
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);

    await connectDB();
});
