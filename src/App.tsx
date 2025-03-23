import Router from "./Router";
import { useTheme } from "./context/ThemeContext";

function App() {
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
