import { FC } from "react";
import { clsx } from "clsx";

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
}
export default function CircularProgress({
    progress,
    size = 120,
    strokeWidth = 8,
    color = "text-primary",
    trackColor = "stroke-outline",
}: CircularProgressProps) {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset =
        circumference - (normalizedProgress / 100) * circumference;

    return (
        <div className={"relative inline-block"}>
            <svg width={size} height={size}>
                {/* background track */}
                <circle
                    className={trackColor}
                    strokeWidth={strokeWidth}
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
                    strokeWidth={strokeWidth}
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
            {/* display progress text in the center */}
            <div
                className={"absolute inset-0 flex items-center justify-center"}
            >
                <span className={"text-xl font-bold"}>
                    {normalizedProgress.toFixed(2)}%
                </span>
            </div>
        </div>
    );
}
