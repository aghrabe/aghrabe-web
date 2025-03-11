import { clsx } from "clsx";

interface CircularProgressProps {
    progress: number;
    text?: string;
    size?: "small" | "medium" | "large";
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
}

export default function CircularProgress({
    progress,
    text,
    size = "medium",
    strokeWidth,
    color = "text-primary",
    trackColor = "stroke-outline",
}: CircularProgressProps) {
    const defaultSizes = {
        small: { diameter: 100, strokeWidth: 6, textClass: "text-sm" },
        medium: { diameter: 200, strokeWidth: 8, textClass: "text-2xl" },
        large: { diameter: 400, strokeWidth: 12, textClass: "text-5xl" },
    };

    const {
        diameter,
        textClass,
        strokeWidth: defaultStroke,
    } = defaultSizes[size];
    const effectiveStroke = strokeWidth ?? defaultStroke;

    const center = diameter / 2;
    const radius = center - effectiveStroke / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset =
        circumference - (normalizedProgress / 100) * circumference;

    return (
        <div className={"relative inline-block"}>
            <svg width={diameter} height={diameter}>
                {/* background track */}
                <circle
                    className={trackColor}
                    strokeWidth={effectiveStroke}
                    stroke={"currentColor"}
                    fill={"transparent"}
                    cx={center}
                    cy={center}
                    r={radius}
                />
                {/* progress indicator */}
                <circle
                    className={clsx(
                        color,
                        "transition-all duration-500 ease-in-out",
                    )}
                    strokeWidth={effectiveStroke}
                    strokeLinecap={"round"}
                    stroke={"currentColor"}
                    fill={"transparent"}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>
            {/* centered progress text */}
            <div
                className={"absolute inset-0 flex items-center justify-center"}
            >
                <span className={clsx(textClass, "font-bold")}>
                    {text ? <>{text}</> : <>{normalizedProgress.toFixed(2)}%</>}
                </span>
            </div>
        </div>
    );
}
