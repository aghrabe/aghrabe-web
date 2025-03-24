import React, { ReactNode, useEffect, useState } from "react";
import ContextGenerator from "./ContextGenerator";

interface BreakpointContextType {
    width: number;
    breakpoint: string;
    setWidth: (width: number) => void;
}

export const { Provider, useContextValue: useBreakpoint } =
    ContextGenerator<BreakpointContextType>("Breakpoint");

function getBreakpoint(width: number): string {
    switch (true) {
        case width < 640:
            return "xs";
        case width < 768:
            return "sm";
        case width < 1024:
            return "md";
        case width < 1280:
            return "lg";
        case width < 1536:
            return "xl";
        default:
            return "2xl";
    }
}

export const BreakpointProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = getBreakpoint(width);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Provider value={{ width, breakpoint, setWidth }}>{children}</Provider>
    );
};
