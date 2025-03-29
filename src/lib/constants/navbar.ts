import { ComponentType } from "react";
import HomeIcon from "../../assets/icons/HomeIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import StatsIcon from "../../assets/icons/StatsIcon";

interface NavItem {
    name: string;
    href: string;
    IconComponent: ComponentType;
}

export function getNavItems(userId: string): Array<NavItem> {
    return [
        {
            name: "Home",
            href: `/${userId}/home`,
            IconComponent: HomeIcon,
        },
        {
            name: "Stats",
            href: `/${userId}/stats`,
            IconComponent: StatsIcon,
        },
        {
            name: "Settings",
            href: `/${userId}/settings`,
            IconComponent: SettingsIcon,
        },
    ];
}
