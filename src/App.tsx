import { useEffect } from "react";
import Router from "./Router";
import useSettings from "./hooks/useSettings";

function App() {
    const { globalTheme } = useSettings();

    useEffect(() => {
        console.log(globalTheme.toLowerCase());
    }, [globalTheme]);

    return (
        <div
            className={`font-sans w-full min-h-screen text-on-background bg-background ${globalTheme.toLowerCase()}`}
        >
            <Router />
        </div>
    );
}

export default App;
