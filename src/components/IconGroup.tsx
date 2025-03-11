import { ReactNode } from "react";
import { clsx } from "clsx";

interface Props {
    children: ReactNode;
    direction?: "col" | "row";
    spacing?: "tight" | "normal" | "wide";
    className?: string;
}

export default function IconGroup({
    children,
    direction = "row",
    spacing = "normal",
    className,
}: Props) {
    const spacingClasses = {
        tight: "gap-2",
        normal: "gap-4",
        wide: "gap-8",
    };

    const flexDir = direction === "row" ? "flex-row" : "flex-col";

    return (
        <div
            className={clsx(
                "flex items-center",
                flexDir,
                spacingClasses[spacing],
                className,
            )}
        >
            {children}
        </div>
    );
}
