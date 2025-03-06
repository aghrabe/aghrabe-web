import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuthContext();

    return (
        <>
            <div>Dashboard</div>
            <Button onClick={logout}>Logout</Button>
        </>
    );
}
