export type AuthType = "register" | "login";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload extends LoginPayload {
    passwordConfirm: string;
}

export type AuthPayload = LoginPayload | RegisterPayload;

export interface User {
    id: string;
    password: string;
    tokenKey: string;
    email: string;
    name: string;
    avatar: string;
    created: Date;
    updated: Date;
}
