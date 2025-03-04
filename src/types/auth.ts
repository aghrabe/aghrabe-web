export type AuthType = "register" | "login";
export type AuthValueType = { email: string; password: string };
export type LoginValueType = AuthValueType;
export type RegisterValueType = AuthValueType & { passwordConfirm: string };
