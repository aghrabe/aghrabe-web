import React, { useEffect, useState } from "react";
import ContextGenerator from "./ContextGenerator";

interface ThemeContextType {
    globalTheme: string;
    setGlobalTheme: React.Dispatch<React.SetStateAction<string>>;
}

const { Provider, useContextValue: useTheme } =
    ContextGenerator<ThemeContextType>("Theme");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [globalTheme, setGlobalTheme] = useState<string>(() => {
        return localStorage.getItem("globalTheme") || "Light";
    });

    useEffect(() => {
        localStorage.setItem("globalTheme", globalTheme);
    }, [globalTheme]);

    return (
        <Provider value={{ globalTheme, setGlobalTheme }}>{children}</Provider>
    );
}

export { useTheme };
