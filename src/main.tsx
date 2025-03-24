import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SessionProvider } from "./context/SessionContext.tsx";
import { BreakpointProvider } from "./context/BreakpointContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BreakpointProvider>
            <ThemeProvider>
                <AuthProvider>
                    <SessionProvider>
                        <App />
                    </SessionProvider>
                </AuthProvider>
            </ThemeProvider>
        </BreakpointProvider>
    </StrictMode>,
);
