import useSettings from "../hooks/useSettings";

const availableThemes = [
    {
        themeName: "Default",
        colors: ["bg-surface", "text-on-surface", "bg-primary"],
    },
    {
        themeName: "Dark",
        colors: ["bg-surface", "text-on-surface", "bg-primary"],
    },
    {
        themeName: "Catppuccin",
        colors: ["bg-surface", "text-on-surface", "bg-primary"],
    },
    {
        themeName: "Tokyonight",
        colors: ["bg-surface", "text-on-surface", "bg-primary"],
    },
];

export default function ThemeSelector() {
    const { globalTheme, setGlobalTheme } = useSettings();

    return (
        <div className={"grid grid-cols-2 gap-4"}>
            {availableThemes.map((theme) => (
                <button
                    key={theme.themeName}
                    className={`flex flex-col items-center border-[2px] ${
                        theme.themeName.toLowerCase() ===
                        globalTheme.toLowerCase()
                            ? "border-accent"
                            : "border-greytext"
                    } rounded-md p-4 transition-opacity duration-150 ease-in-out hover:border-icon`}
                    onClick={() => setGlobalTheme(theme.themeName)}
                >
                    <h4 className={"text-md md:text-lg"}>{theme.themeName}</h4>
                    <div className={"py-4 flex gap-2"}>
                        {theme.colors.map((color) => (
                            <div
                                key={color}
                                className={`w-4 h-8 ${color} rounded-sm`}
                            ></div>
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
}
