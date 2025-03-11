import Button from "../components/Button";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuthContext();

    return (
        <div className={"w-full"}>
            <Header header={"Dashboard"}></Header>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}
