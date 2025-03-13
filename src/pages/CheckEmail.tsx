import { useState } from "react";
import { useLocation } from "react-router-dom";

import Button from "../components/Button";
import supabase from "../services/supabaseClient";

export default function CheckEmail() {
    const location = useLocation();
    const email = (location.state as { email: string } | null)?.email || "";
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleResend = async () => {
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resend({
            email,
            type: "signup",
        });

        if (error) {
            setMessage("Error resending email. Please try again later.");
        } else {
            setMessage("Verification email resent! Please check your inbox.");
        }
        setLoading(false);
    };

    return (
        <div
            className={
                "flex flex-col items-center justify-center min-h-screen p-4"
            }
        >
            <h1 className={"text-3xl font-bold mb-4"}>Check Your Email</h1>
            <p className={"text-lg text-center"}>
                We’ve sent a verification email to <strong>{email}</strong>.
                <br />
                Please click the link in the email to verify your account.
            </p>
            <div className={"mt-6"}>
                <Button
                    onClick={handleResend}
                    disabled={loading}
                    loading={loading}
                    size={"medium"}
                >
                    Resend Verification Email
                </Button>
            </div>
            {message && <p className={"mt-4 text-center"}>{message}</p>}
        </div>
    );
}
