import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className={"flex min-h-screen"}>
            <Sidebar />
            <main className={"w-full p-4"}>{children}</main>
        </div>
    );
}
