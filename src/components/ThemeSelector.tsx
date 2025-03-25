import { useTheme } from "../context/ThemeContext";

const availableThemes = [
    {
        themeName: "Light",
        colors: [
            "bg-[#ffffff]",
            "bg-[#2563eb]",
            "bg-[#dc2626]",
            "bg-[#059669]",
        ],
    },
    {
        themeName: "Dark",
        colors: [
            "bg-[#2d2d2d]",
            "bg-[#3b82f6]",
            "bg-[#ef4444]",
            "bg-[#10b981]",
        ],
    },
    {
        themeName: "Catppuccin",
        colors: [
            "bg-[#313244]",
            "bg-[#89b4fa]",
            "bg-[#f38ba8]",
            "bg-[#a6e3a1]",
        ],
    },
    {
        themeName: "Tokyonight",
        colors: [
            "bg-[#292e42]",
            "bg-[#7aa2f7]",
            "bg-[#f7768e]",
            "bg-[#9ece6a]",
        ],
    },
];

export default function ThemeSelector() {
    const { globalTheme, setGlobalTheme } = useTheme();

    return (
        <div className={"grid grid-cols-2 md:grid-cols-4 gap-4"}>
            {availableThemes.map((theme) => (
                <button
                    type={"button"}
                    key={theme.themeName}
                    className={`flex flex-col items-center border-[2px] ${theme.themeName.toLowerCase() ===
                            globalTheme.toLowerCase()
                            ? "border-primary"
                            : "border-outline"
                        } rounded-md p-2 md:p-4 transition-opacity duration-150 ease-in-out hover:border-icon cursor-pointer`}
                    onClick={() => setGlobalTheme(theme.themeName)}
                >
                    <h4 className={"text-md md:text-lg"}>{theme.themeName}</h4>
                    <div className={"py-2 md:py-4 flex gap-1 md:gap-2"}>
                        {theme.colors.map((color) => (
                            <div
                                key={color}
                                className={`w-3 h-6 md:w-4 md:h-8 ${color} rounded-sm`}
                            ></div>
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
}
