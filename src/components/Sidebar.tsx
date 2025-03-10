import { useAuthContext } from "../context/AuthContext";

export default function Sidebar() {
    const { user } = useAuthContext();

    return (
        <aside className={"border border-pink-400"}>
            <p>sidebar</p>
            <img />
        </aside>
    );
}
