import { ReactNode } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MobileNavbar from "../components/Sidebar/MobileNavbar";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className={"flex h-full"}>
            <Sidebar />
            <main
                className={
                    "w-full h-full md:h-screen box-border pb-16 pt-6 md:py-6 px-8"
                }
            >
                {children}
            </main>
            <MobileNavbar />
        </div>
    );
}
