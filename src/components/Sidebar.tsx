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
                <IconGroup direction={"col"} spacing={"wide"}>
                    {navItems.map(({ name, href, IconComponent }) => {
                        const isActive = location.pathname === href;
                        return (
                            <Link key={name} to={href}>
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
