import { useEffect } from "react";
import { useBreakpoint } from "../context/BreakpointContext";

export default function useWidowWidth(): void {
    const { setWidth } = useBreakpoint();

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);

        // initial check
        handleResize();

        // cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setWidth]);
}
