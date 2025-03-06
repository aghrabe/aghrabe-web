import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";

export default function Dashboard() {
    const { logout } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dashboard");
        }
    });

    return (
        <>
            <div>Dashboard</div>
            <Button
                onClick={() => {
                    logout();
                }}
            >
                Logout
            </Button>
        </>
    );
}
