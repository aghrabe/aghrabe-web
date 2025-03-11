import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuthContext();

    return (
        <div className={"w-full"}>
            <p>Dashboard</p>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}
