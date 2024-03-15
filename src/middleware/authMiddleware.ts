import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { JWTDecodedValue } from "../types/authTypes";

const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = (req.headers.authorization ||
            req.headers.Authorization) as string;

        if (!authHeader) {
            res.status(401);
            throw new Error("Unauthorized.");
        }

        if (!authHeader.startsWith("Bearer ")) {
            res.status(401);
            throw new Error("Unauthorized.");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401);
            throw new Error("Unauthorized.");
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as JWTDecodedValue;

        req.user = await User.findById(decoded.user.id).select("-password");

        next();
    } catch (error) {
        next(error);
    }
};

export { protect };
