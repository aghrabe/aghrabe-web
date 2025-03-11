import { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import avatar from "../assets/photo_2023-04-19_07-10-35.jpg";

import HomeIcon from "../assets/icons/HomeIcon";
import SessionIcon from "../assets/icons/SessionIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import StatsIcon from "../assets/icons/StatsIcon";
import { useAuthContext } from "../context/AuthContext";
import Icon from "./Icon";
import IconGroup from "./IconGroup";
import SyncIcon from "../assets/icons/SyncIcon";
import Button from "./Button";

interface NavItem {
    name: string;
    href: string;
    IconComponent: ComponentType;
}

export default function Sidebar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) {
        return;
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
            name: "Settings",
            href: `/${user.id}/settings`,
            IconComponent: SettingsIcon,
        },
        {
            name: "Statistics",
            href: `/${user.id}/stats`,
            IconComponent: StatsIcon,
        },
    ];

    return (
        <aside
            className={
                "flex flex-col items-center justify-between bg-surface px-2 py-6 max-w-16 min-w-16 text-outline-variant"
            }
        >
            <div className="space-y-8">
                <img
                    src={avatar}
                    className={"w-12 h-12 rounded-md object-cover"}
                />
                <IconGroup direction={"col"} spacing={"normal"}>
                    {navItems.map(({ name, href, IconComponent }) => {
                        const isActive = location.pathname === href;
                        return (
                            <Link
                                key={name}
                                to={href}
                                className={
                                    "w-full h-12 flex items-center justify-center"
                                }
                            >
                                <div className={"group relative"}>
                                    <Icon
                                        size={"large"}
                                        className={
                                            isActive
                                                ? "text-on-surface"
                                                : "hover:text-on-surface-varient transition-all duration-300"
                                        }
                                    >
                                        <IconComponent />
                                    </Icon>
                                    <div
                                        className={
                                            "absolute left-full top-1/2 -translate-y-1/2 ml-6 px-3 py-1.5 rounded-md bg-surface text-on-surface text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 delay-150 pointer-events-none shadow-md before:absolute before:left-0 before:top-1/2 before:-translate-x-full before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-surface-container"
                                        }
                                    >
                                        {name}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </IconGroup>
            </div>
            <Button
                customColor
                variant={"text"}
                className={"hover:text-on-surface-varient"}
            >
                <Icon size={"large"}>
                    <SyncIcon />
                </Icon>
            </Button>
        </aside>
    );
}
