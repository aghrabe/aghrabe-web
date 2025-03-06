import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { PocketBaseProvider } from "./context/PocketBaseContext.tsx";
import PocketBase from "pocketbase";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PocketBaseProvider value={new PocketBase("http://localhost:8090")}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </PocketBaseProvider>
    </StrictMode>,
);
