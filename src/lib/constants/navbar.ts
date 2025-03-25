import { ComponentType } from "react";
import HomeIcon from "../../assets/icons/HomeIcon";
import SessionIcon from "../../assets/icons/SessionIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";

interface NavItem {
    name: string;
    href: string;
    IconComponent: ComponentType;
}

export function getNavItems(userId: string): Array<NavItem> {
    const navItems = [
        {
            name: "Dashboard",
            href: `/${userId}/dashboard`,
            IconComponent: HomeIcon,
        },
        {
            name: "Session",
            href: `/${userId}/session`,
            IconComponent: SessionIcon,
        },
        {
            name: "Settings",
            href: `/${userId}/settings`,
            IconComponent: SettingsIcon,
        },
    ];
    return navItems;
}
