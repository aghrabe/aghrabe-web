import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { CurrentSessionProvider } from "./context/CurrentSessionContext.tsx";
import { BreakpointProvider } from "./context/BreakpointContext.tsx";
import { CurrentGameProvider } from "./context/CurrentGameContext.tsx";
import { FeedbackProvider } from "./context/FeedbackContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BreakpointProvider>
                <AuthProvider>
                    <CurrentGameProvider>
                        <FeedbackProvider>
                            <CurrentSessionProvider>
                                <App />
                            </CurrentSessionProvider>
                        </FeedbackProvider>
                    </CurrentGameProvider>
                </AuthProvider>
            </BreakpointProvider>
        </ThemeProvider>
    </StrictMode>,
);
