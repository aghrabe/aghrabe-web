import { Brain } from "lucide-react";

interface MoodSelectorProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    getMoodIcon: (mood: number) => React.ReactNode;
    getMoodText: (mood: number) => string;
}

export function MoodSelector({
    label,
    value,
    onChange,
    getMoodIcon,
    getMoodText,
}: MoodSelectorProps) {
    return (
        <div className={"space-y-2 md:space-y-4"}>
            <div className={"flex gap-3"}>
                <Brain className={"h-5 w-5 md:h-6 md:w-6 text-primary"} />
                <p className={"text-sm md:text-lg font-medium"}>{label}</p>
            </div>
            <div className={"flex justify-between items-center"}>
                {[1, 2, 3, 4, 5].map((mood) => {
                    const isActive = mood === value;
                    return (
                        <div
                            key={mood}
                            className={
                                "min-w-14 sm:min-w-20 flex flex-col justify-center items-center gap-1 md:gap-2"
                            }
                        >
                            <button
                                type={"button"}
                                onClick={() => onChange(mood)}
                                className={`p-2 rounded-full transition-all ${
                                    isActive
                                        ? "bg-outline"
                                        : "bg-card hover:bg-outline cursor-pointer"
                                }`}
                            >
                                {getMoodIcon(mood)}
                            </button>
                            <p
                                className={`whitespace-nowrap ${
                                    isActive ? "opacity-100" : "opacity-0"
                                } text-center text-xs md:text-sm`}
                            >
                                {getMoodText(mood)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
