import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeContextProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeContextProvider>
    </StrictMode>,
);
