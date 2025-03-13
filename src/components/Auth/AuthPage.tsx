import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext";
import {
    AuthType,
    LoginSchemaType,
    RegisterSchemaType,
} from "../../lib/types/auth";
import AuthForm from "./AuthForm";
import LoadingPage from "../../pages/LoadingPage";

interface AuthPageProps {
    type: AuthType;
}

export default function AuthPage({ type }: AuthPageProps) {
    const { user, isLoading, login, register } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();

    const isLogin = type === "login";
    const text = isLogin
        ? "Don't have an account? "
        : "Already have an account? ";
    const linkText = isLogin ? "Sign Up" : "Login";
    const linkTo = isLogin ? "/register" : "/login";

    useEffect(() => {
        if (!isLoading && user) {
            setIsRedirecting(true);
            navigate(`/${user.id}/dashboard`);
        }
    }, [user, isLoading, navigate]);

    if (isLoading || isRedirecting) {
        return <LoadingPage />;
    }

    async function handleSubmit(values: LoginSchemaType | RegisterSchemaType) {
        setError(null);

        let authError;
        if (isLogin) {
            authError = await login(
                (values as LoginSchemaType).email,
                (values as LoginSchemaType).password,
            );
        } else {
            authError = await register(
                (values as RegisterSchemaType).email,
                (values as RegisterSchemaType).password,
                (values as RegisterSchemaType).passwordConfirm,
            );
        }

        if (authError) {
            setError(authError.message);
        } else {
            if (type === "register") {
                navigate("/check-email", {
                    state: { email: (values as RegisterSchemaType).email },
                });
            }
        }
    }

    return (
        <div className={"w-full min-h-screen flex justify-center items-center"}>
            <div
                className={
                    "w-full max-w-xl flex flex-col items-center justify-center md:p-6 gap-4"
                }
            >
                {/*
                    TODO: send notifications instead
                */}
                {error && <p className={"text-error text-2xl"}>{error}</p>}
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
