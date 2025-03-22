import React, { useEffect, useState } from "react";
import ContextGenerator from "./ContextGenerator";

interface ThemeContextType {
    globalTheme: string;
    setGlobalTheme: React.Dispatch<React.SetStateAction<string>>;
}

const { Provider: ThemeProvider, useContextValue: useTheme } =
    ContextGenerator<ThemeContextType>("Theme");

export function ThemeContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [globalTheme, setGlobalTheme] = useState<string>(() => {
        return localStorage.getItem("globalTheme") || "Light";
    });

    useEffect(() => {
        localStorage.setItem("globalTheme", globalTheme);
    }, [globalTheme]);

    return (
        <ThemeProvider value={{ globalTheme, setGlobalTheme }}>
            {children}
        </ThemeProvider>
    );
}

export { useTheme };
