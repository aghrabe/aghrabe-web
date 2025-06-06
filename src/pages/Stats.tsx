import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import { useTheme } from "../context/ThemeContext";
import useGames from "../hooks/useGames";
import useSessions from "../hooks/useSessions";
import { useTotalTime } from "../hooks/useTotalTime";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend,
);

interface StatCardProps {
    title: string;
    value: string;
}

function StatCard({ title, value }: StatCardProps) {
    return (
        <div
            className={
                "flex flex-col items-center justify-center text-center bg-surface p-4 rounded-md text-on-surface gap-2"
            }
        >
            <h4 className={"text-primary font-bold md:text-xl text-md"}>
                {title}
            </h4>
            <p className={"text-sm md:text-lg"}>{value}</p>
        </div>
    );
}

export default function Stats() {
    const { gamesState, getTotalTimeAllTimeFromGames } = useGames();
    const { globalTheme } = useTheme();

    const getThemeColors = useCallback(() => {
        let themeColors: {
            primary: string;
            error: string;
            success: string;
            info: string;
        };

        switch (globalTheme) {
            case "Dark":
                themeColors = {
                    primary: "#3b82f6",
                    error: "#ef4444",
                    success: "#10b981",
                    info: "#06b6d4",
                };
                break;
            case "Catppuccin":
                themeColors = {
                    primary: "#89b4fa",
                    error: "#f38ba8",
                    success: "#a6e3a1",
                    info: "#89dceb",
                };
                break;
            case "Tokyonight":
                themeColors = {
                    primary: "#7aa2f7",
                    error: "#f7768e",
                    success: "#9ece6a",
                    info: "#7dcfff",
                };
                break;

            default:
                themeColors = {
                    primary: "#2563eb",
                    error: "#dc2626",
                    success: "#059669",
                    info: "#0891b2",
                };
                break;
        }

        return themeColors;
    }, [globalTheme]);

    function formatMinutesToTimeString(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes}m`;
    }

    const { getTotalTimeLastWeek, getTotalTimeToday } = useSessions();
    const totalTimeAllTime = useTotalTime(getTotalTimeAllTimeFromGames);
    const totalTimeLastWeek = useTotalTime(getTotalTimeLastWeek);
    const totalTimeToday = useTotalTime(getTotalTimeToday);

    // TODO: TEMP
    const dayProgress = 50;

    const [themeColors, setThemeColors] = useState(getThemeColors());

    useEffect(() => {
        setThemeColors(getThemeColors());
    }, [globalTheme, getThemeColors]);

    const mockData = useMemo(
        () => ({
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
            ],
            datasets: [
                {
                    label: "Played Time",
                    data: [65, 59, 80, 81, 56, 20, 40],
                    fill: false,
                    backgroundColor: `${themeColors.primary}66`,
                    borderColor: themeColors.primary,
                    pointStyle: "circle",
                    pointRadius: 10,
                    pointHoverRadius: 15,
                },
                {
                    label: "Mood Before",
                    data: [81, 56, 33, 65, 59, 80, 40],
                    fill: false,
                    backgroundColor: `${themeColors.error}66`,
                    borderColor: themeColors.error,
                    pointStyle: "circle",
                    pointRadius: 10,
                    pointHoverRadius: 15,
                },
                {
                    label: "Mood After",
                    data: [55, 81, 40, 10, 59, 65, 80],
                    fill: false,
                    backgroundColor: `${themeColors.info}66`,
                    borderColor: themeColors.info,
                    pointStyle: "circle",
                    pointRadius: 10,
                    pointHoverRadius: 15,
                },
            ],
        }),
        [themeColors],
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
            title: {
                display: false,
                text: "Play Time",
            },
        },
    } as ChartOptions<"line">;

    useEffect(() => {
        console.log("gamesState.isLoading:", gamesState.isLoading);
        console.log("gamesState.data:", gamesState.data);
        console.log(
            "totalTimeLastWeek.isLoading:",
            totalTimeLastWeek.isLoading,
        );
        console.log(
            "totalTimeLastWeek.totalTime:",
            totalTimeLastWeek.totalTime,
        );
        console.log("totalTimeAllTime.isLoading:", totalTimeAllTime.isLoading);
        console.log("totalTimeAllTime.totalTime:", totalTimeAllTime.totalTime);
        console.log("totalTimeToday.isLoading:", totalTimeToday.isLoading);
        console.log("totalTimeToday.totalTime:", totalTimeToday.totalTime);
    }, [
        gamesState.isLoading,
        gamesState.data,
        totalTimeLastWeek.isLoading,
        totalTimeLastWeek.totalTime,
        totalTimeAllTime.isLoading,
        totalTimeAllTime.totalTime,
        totalTimeToday.isLoading,
        totalTimeToday.totalTime,
    ]);

    if (
        gamesState.isLoading ||
        totalTimeLastWeek.isLoading ||
        totalTimeAllTime.isLoading ||
        totalTimeToday.isLoading
    ) {
        return (
            <div className={"min-h-screen flex items-center justify-center"}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={"w-full flex flex-col gap-8 px-4"}>
            <Header header={"Stats"}></Header>

            <div className={"grid grid-cols-2 lg:grid-cols-4 gap-4"}>
                <StatCard
                    title={"Top Game"}
                    value={
                        gamesState.data && gamesState.data.length > 0
                            ? gamesState.data[0].title
                            : "Nothing Yet"
                    }
                />
                <StatCard title={"Top This Week"} value={"Elden Ring"} />
                {totalTimeAllTime && (
                    <StatCard
                        title={"Total Time"}
                        value={`${formatMinutesToTimeString(totalTimeAllTime.totalTime || 0)}`}
                    />
                )}
                {totalTimeLastWeek && (
                    <StatCard
                        title={"This Week"}
                        value={`${formatMinutesToTimeString(totalTimeLastWeek.totalTime || 0)}`}
                    />
                )}
            </div>

            <ProgressBar progress={dayProgress} />

            <div className={"w-full xl:flex xl:justify-between"}>
                <div className={"chart-container w-full h-[40vh] md:h-[400px]"}>
                    <Line data={mockData} options={options} />
                </div>

                {/*
                <div className="w-full max-w-xs mx-auto">
                    <Doughnut data={doughnutData} />
                </div>
                */}
            </div>
        </div>
    );
}
