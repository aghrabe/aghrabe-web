import Router from "./Router";
import { useTheme } from "./context/ThemeContext";
import useWidowWidth from "./hooks/useWindowWidth";

function App() {
    useWidowWidth();

    const { globalTheme } = useTheme();

    return (
        <div
            className={`font-sans w-full min-h-screen text-on-background bg-background ${globalTheme.toLowerCase()}`}
        >
            <Router />
        </div>
    );
}

export default App;
