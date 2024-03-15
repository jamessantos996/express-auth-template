export type JWTDecodedValue = {
    user: {
        id: number;
        email: string;
    };
};

export type AuthLoginRequestBody = {
    email: string;
    password: string;
};

export type AuthLoginResponse = {
    accessToken: string;
};

export type AuthSignUpRequestBody = {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
};
