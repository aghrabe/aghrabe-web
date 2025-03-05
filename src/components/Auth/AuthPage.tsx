import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import AuthForm from "./AuthForm";
import { AuthPayload, LoginPayload, RegisterPayload } from "../../types/auth";

interface AuthPageProps {
    type: "login" | "register";
}

export default function AuthPage({ type }: AuthPageProps) {
    const { login, register } = useAuthContext();
    const navigate = useNavigate();

    const isLogin = type === "login";

    const text = isLogin
        ? "Don't have an account? "
        : "Already have an account? ";
    const linkText = isLogin ? "Sign Up" : "Login";
    const linkTo = isLogin ? "/register" : "/login";

    async function handleSubmit(values: AuthPayload) {
        try {
            if (isLogin) {
                await login(
                    (values as LoginPayload).email,
                    (values as LoginPayload).password,
                );
            } else {
                await register(
                    (values as RegisterPayload).email,
                    (values as RegisterPayload).password,
                    (values as RegisterPayload).passwordConfirm,
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
                    "w-full max-w-xl flex flex-col items-center justify-center p-6 gap-4"
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
