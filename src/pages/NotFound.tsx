import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div
            className={
                "flex flex-col items-center justify-center h-screen text-center space-y-6"
            }
        >
            <h1 className={"text-6xl font-bold text-primary"}>404</h1>
            <p className={"text-2xl text-on-background"}>Page Not Found :(</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
    );
}
