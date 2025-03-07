import Button from "../components/Button";
import SessionTracker from "../components/SessionTracker";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuthContext();

    return (
        <>
            <div>Dashboard</div>
            <SessionTracker />
            <Button onClick={logout}>Logout</Button>
        </>
    );
}
