import { ReactNode } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileSidebar from "../components/Sidebar/MobileSidebar";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className={"flex h-full"}>
            <Sidebar />
            <main className={"w-full h-full md:h-screen box-border py-6 px-8"}>
                {children}
            </main>
            <MobileSidebar />
        </div>
    );
}
