import { Link, useLocation } from "react-router-dom";
import avatar from "../../assets/photo_2023-04-19_07-10-35.jpg";

import SyncIcon from "../../assets/icons/SyncIcon";
import { useAuthContext } from "../../context/AuthContext";
import { getNavItems } from "../../lib/constants/navbar";
import Button from "../Button";
import Icon from "../Icon";
import IconGroup from "../IconGroup";

interface TooltipProps {
    name: string;
}

function Tooltip({ name }: TooltipProps) {
    return (
        <div
            className={
                "absolute left-full top-1/2 -translate-y-1/2 ml-6 px-3 py-1.5 rounded-md bg-surface text-on-surface text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 delay-150 pointer-events-none shadow-md before:absolute before:left-0 before:top-1/2 before:-translate-x-full before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-surface-container"
            }
        >
            {name}
        </div>
    );
}

export default function Sidebar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) {
        return;
    }

    const navItems = getNavItems(user.id);

    return (
        <aside
            className={
                "hidden md:flex flex-col items-center justify-between bg-surface px-2 py-6 max-w-16 min-w-16 text-outline-variant"
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
                                    <Tooltip name={name} />
                                </div>
                            </Link>
                        );
                    })}
                </IconGroup>
            </div>
            <div className={"group relative"}>
                <Button
                    customColor
                    variant={"text"}
                    className={"w-12 h-12 !p-0 hover:text-on-surface-varient"}
                >
                    <Icon size={"large"}>
                        <SyncIcon />
                    </Icon>
                </Button>
                <Tooltip name={"Sync"} />
            </div>
        </aside>
    );
}
