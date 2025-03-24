import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../../assets/icons/HomeIcon";
import SessionIcon from "../../assets/icons/SessionIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import StatsIcon from "../../assets/icons/StatsIcon";
import { useAuthContext } from "../../context/AuthContext";
import Icon from "../Icon";

interface NavItem {
    name: string;
    href: string;
    IconComponent: ComponentType;
}

export default function MobileNavbar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) {
        return null;
    }

    const navItems: Array<NavItem> = [
        {
            name: "Dashboard",
            href: `/${user.id}/dashboard`,
            IconComponent: HomeIcon,
        },
        {
            name: "Session",
            href: `/${user.id}/session`,
            IconComponent: SessionIcon,
        },
        {
            name: "Stats",
            href: `/${user.id}/stats`,
            IconComponent: StatsIcon,
        },
        {
            name: "Settings",
            href: `/${user.id}/settings`,
            IconComponent: SettingsIcon,
        },
    ];

    return (
        <nav
            className={
                "md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline z-10"
            }
        >
            <div className={"flex justify-around items-center px-2 py-3"}>
                {navItems.map(({ name, href, IconComponent }) => {
                    const isActive = location.pathname === href;
                    return (
                        <Link
                            key={name}
                            to={href}
                            className={`flex flex-col items-center ${isActive ? "text-on-surface" : "text-outline-variant"}`}
                        >
                            <Icon size={"medium"}>
                                <IconComponent />
                            </Icon>
                            <span className={"text-xs mt-1 font-medium"}>
                                {name}
                            </span>
                        </Link>
                    );
                })}
                {/*
                <Button
                    customColor
                    variant={"text"}
                    className={"flex flex-col items-center text-outline-variant"}
                >
                    <Icon size={"medium"}>
                        <SyncIcon />
                    </Icon>
                    <span className={"text-xs mt-1 font-medium"}>Sync</span>
                </Button>
                */}
            </div>
        </nav>
    );
}
