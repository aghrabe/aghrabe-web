import { ReactNode, useEffect, useState } from "react";
import { TAILWIND_BREAKPOINTS } from "../lib/constants/tailwind";
import ContextGenerator from "./ContextGenerator";

interface BreakpointContextType {
    width: number;
    breakpoint: string;
    isMobile: boolean;
    setWidth: (width: number) => void;
}

const { Provider, useContextValue: useBreakpoint } =
    ContextGenerator<BreakpointContextType>("Breakpoint");

function getBreakpoint(width: number): string {
    if (width >= TAILWIND_BREAKPOINTS["2xl"]) return "2xl";
    if (width >= TAILWIND_BREAKPOINTS.xl) return "xl";
    if (width >= TAILWIND_BREAKPOINTS.lg) return "lg";
    if (width >= TAILWIND_BREAKPOINTS.md) return "md";
    if (width >= TAILWIND_BREAKPOINTS.sm) return "sm";
    return "xs";
}

export function BreakpointProvider({ children }: { children: ReactNode }) {
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = getBreakpoint(width);
    const isMobile = width < TAILWIND_BREAKPOINTS.md;

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Provider value={{ width, breakpoint, isMobile, setWidth }}>
            {children}
        </Provider>
    );
}

export { useBreakpoint };
