import Button from "../components/Button";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthContext";

export default function Stats() {
    const { logout, isLoading } = useAuthContext();

    return (
        <div className={"w-full"}>
            <Header header={"Stats"}></Header>
            <Button onClick={logout} loading={isLoading}>
                Logout
            </Button>
        </div>
    );
}
