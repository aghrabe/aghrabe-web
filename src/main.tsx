import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SessionProvider } from "./context/SessionContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <SessionProvider>
                    <App />
                </SessionProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
