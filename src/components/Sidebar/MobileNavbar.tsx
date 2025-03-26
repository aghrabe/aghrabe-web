import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { getNavItems } from "../../lib/constants/navbar";
import Icon from "../Icon";

export default function MobileNavbar() {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) {
        return null;
    }

    const navItems = getNavItems(user.id);

    return (
        <nav
            className={
                "md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline z-10"
            }
        >
            <div className={"flex justify-between items-center px-8 py-3"}>
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
            </div>
        </nav>
    );
}
