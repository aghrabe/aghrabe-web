import AuthForm from "../components/AuthForm";
import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";
import { LoginValueType } from "../types/auth";

export default function Auth() {
    const { authType, setAuthType } = useAuthContext();
    const authTogglePrompt =
        authType === "login"
            ? "Don't have an account?"
            : "Already Have an account?";

    function handleAuth(value: LoginValueType) {
        console.log("Authvalue: ", value);
        // console.log("activeTab", activeTab);
    }

    return (
        <div className={"w-full min-h-screen flex justify-center items-center"}>
            <div
                className={
                    "w-full max-w-xl flex flex-col items-center justify-center p-6"
                }
            >
                <AuthForm type={authType} onSubmit={handleAuth} />
                <span className={"text-lg text-on-background-varient"}>
                    {authTogglePrompt}
                    <Button
                        size={"medium"}
                        variant={"text"}
                        onClick={() => {
                            setAuthType((prev) =>
                                prev === "login" ? "register" : "login",
                            );
                        }}
                    >
                        {authType === "login" ? "Sign Up" : "Login"}
                    </Button>
                </span>
            </div>
        </div>
    );
}
