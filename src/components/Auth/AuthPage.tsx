import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuthContext } from "../../context/AuthContext";
import {
    AuthType,
    LoginSchemaType,
    RegisterSchemaType,
} from "../../types/auth";
import AuthForm from "./AuthForm";

interface AuthPageProps {
    type: AuthType;
}

export default function AuthPage({ type }: AuthPageProps) {
    const { user, login, register } = useAuthContext();
    const navigate = useNavigate();

    const isLogin = type === "login";
    const text = isLogin
        ? "Don't have an account? "
        : "Already have an account? ";
    const linkText = isLogin ? "Sign Up" : "Login";
    const linkTo = isLogin ? "/register" : "/login";

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    });

    async function handleSubmit(values: LoginSchemaType | RegisterSchemaType) {
        try {
            if (isLogin) {
                await login(
                    (values as LoginSchemaType).email,
                    (values as LoginSchemaType).password,
                );
            } else {
                await register(
                    (values as RegisterSchemaType).email,
                    (values as RegisterSchemaType).password,
                    (values as RegisterSchemaType).passwordConfirm,
                );
            }
            navigate("/dashboard");
        } catch (err) {
            throw new Error(
                `Error while ${isLogin ? "logging in" : "registering"}: ${err}`,
            );
        }
    }

    return (
        <div className={"w-full min-h-screen flex justify-center items-center"}>
            <div
                className={
                    "w-full max-w-xl flex flex-col items-center justify-center md:p-6 gap-4"
                }
            >
                <AuthForm type={type} onSubmit={handleSubmit} />
                <span className={"text-lg text-on-background-varient"}>
                    {text}
                    <Link
                        to={linkTo}
                        className={"text-primary hover:text-primary-hover"}
                    >
                        {linkText}
                    </Link>
                </span>
            </div>
        </div>
    );
}
