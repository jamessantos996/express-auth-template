import type {
    NextFunction,
    Request,
    Response,
} from "express-serve-static-core";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import {
    AuthLoginRequestBody,
    AuthLoginResponse,
    AuthSignUpRequestBody,
} from "../types/authTypes";
import generateToken from "../utils/generateToken";

// @desc    Login user
// route    POST /auth/sign-in
// @access  public
const authLogin = async (
    req: Request<{}, {}, AuthLoginRequestBody>,
    res: Response<AuthLoginResponse>,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            res.status(401);
            throw new Error("Invalid email or password.");
        }

        if (!(await foundUser.matchPassword(password))) {
            res.status(401);
            throw new Error("Invalid email or password.");
        }

        const { accessToken } = generateToken(res, {
            user: { id: foundUser._id, email: foundUser.email },
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

// @desc    Sign up user
// route    POST /auth/sign-up
// @access  public
const authSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists.");
        }

        const user = await User.create({ ...req.body });

        if (!user) {
            res.status(400);
            throw new Error("Invalid user data.");
        }

        const { accessToken } = generateToken(res, {
            user: { id: user._id, email: user.email },
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// route    GET /auth/refresh
// @access  public
const authRefresh = async (
    req: Request<{}, {}, AuthSignUpRequestBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) {
            res.status(401);
            throw new Error("Unauthorized.");
        }

        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err: any, decoded: any) => {
                if (err) {
                    res.status(403);
                    throw new Error("Forbidden");
                }

                const foundUser = await User.findOne({
                    _id: decoded?.user?.id,
                });

                if (!foundUser) {
                    res.status(401);
                    throw new Error("Unauthorized.");
                }

                const { accessToken } = generateToken(
                    res,
                    {
                        user: {
                            id: foundUser._id,
                            email: foundUser.email,
                        },
                    },
                    { onlyAccessToken: true }
                );

                res.json({ accessToken });
            }
        );
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// route    POST /auth/logout
// @access  public
const authLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);

        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.status(200).json({ message: "Logout success." });
    } catch (error) {
        next(error);
    }
};

export { authLogin, authSignUp, authRefresh, authLogout };
