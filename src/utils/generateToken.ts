import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";

type Options = {
    onlyAccessToken?: boolean;
};

const generateToken = (res: Response, payload: any, options?: Options) => {
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "10s" }
    );

    if (options?.onlyAccessToken) {
        return { accessToken };
    }
    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
};

export default generateToken;
