import { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import avatar from "../assets/photo_2023-12-14_00-00-14.jpg";

import HomeIcon from "../assets/icons/HomeIcon";
import SessionIcon from "../assets/icons/SessionIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import StatsIcon from "../assets/icons/StatsIcon";
import { useAuthContext } from "../context/AuthContext";
import Icon from "./Icon";
import IconGroup from "./IconGroup";

interface NavItem {
    name: string;
    href: string;
    IconComponent: ComponentType;
}

export default function Sidebar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) {
        return <p>Unauthurized!</p>;
    }

    const navItems: Array<NavItem> = [
        {
            name: "dashboard",
            href: `/dashboard/${user.id}`,
            IconComponent: HomeIcon,
        },
        {
            name: "session-history",
            href: "#",
            IconComponent: SessionIcon,
        },
        {
            name: "settings",
            href: "#",
            IconComponent: SettingsIcon,
        },
        {
            name: "statistics",
            href: "#",
            IconComponent: StatsIcon,
        },
    ];

    return (
        <aside
            className={
                "flex flex-col items-center gap-8 bg-surface px-2 py-4 max-w-16"
            }
        >
            <img src={avatar} className={"w-14 rounded-md object-contain"} />
            <IconGroup
                direction={"col"}
                spacing={"wide"}
                className={"text-outline-variant"}
            >
                {navItems.map(({ name, href, IconComponent }) => {
                    const isActive = location.pathname === href;

                    return (
                        <Link key={name} to={href}>
                            <Icon
                                size={"large"}
                                className={isActive ? "text-on-surface" : ""}
                            >
                                <IconComponent />
                            </Icon>
                        </Link>
                    );
                })}
            </IconGroup>
        </aside>
    );
}
