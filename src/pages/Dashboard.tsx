import Button from "../components/Button";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { logout, isLoading } = useAuthContext();

    return (
        <div className={"w-full"}>
            <Header header={"Dashboard"}></Header>
            <Button onClick={logout} loading={isLoading}>
                Logout
            </Button>
        </div>
    );
}
