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
import { Line } from "react-chartjs-2";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import useGames from "../hooks/useGames";

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

const mockData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "Played Time",
            data: [65, 59, 80, 81, 56, 20, 40],
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            pointStyle: "circle",
            pointRadius: 10,
            pointHoverRadius: 15,
        },
        {
            label: "Mood Before",
            data: [81, 56, 33, 65, 59, 80, 40],
            fill: false,
            backgroundColor: "rgba(192,75,192,0.4)",
            borderColor: "rgba(192,75,192,1)",
            pointStyle: "circle",
            pointRadius: 10,
            pointHoverRadius: 15,
        },
        {
            label: "Mood After",
            data: [55, 81, 40, 10, 59, 65, 80],
            fill: false,
            backgroundColor: "rgba(192,192,75,0.4)",
            borderColor: "rgba(192,192,75,1)",
            pointStyle: "circle",
            pointRadius: 10,
            pointHoverRadius: 15,
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: false,
            text: "Play Time",
        },
    },
} as ChartOptions<"line">;

//const totalPlayed = mockData.datasets[0].data.reduce((a, b) => a + b, 0);
//const totalMoodBefore = mockData.datasets[1].data.reduce((a, b) => a + b, 0);
//const totalMoodAfter = mockData.datasets[2].data.reduce((a, b) => a + b, 0);

//const doughnutData = {
//    labels: ["Played Time", "Mood Before", "Mood After"],
//    datasets: [
//        {
//            label: "Total Summary",
//            data: [totalPlayed, totalMoodBefore, totalMoodAfter],
//            backgroundColor: [
//                "rgba(75,192,192,0.6)",
//                "rgba(192,75,192,0.6)",
//                "rgba(192,192,75,0.6)",
//            ],
//            borderColor: [
//                "rgba(75,192,192,1)",
//                "rgba(192,75,192,1)",
//                "rgba(192,192,75,1)",
//            ],
//            borderWidth: 1,
//        },
//    ],
//};

export default function Stats() {
    const { gamesState } = useGames();

    if (gamesState.isLoading) {
        return (
            <div className={"min-h-screen flex items-center justify-center"}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8 px-4">
            <Header header={"Stats"}></Header>

            <div className={"grid grid-cols-2 lg:grid-cols-4 gap-4"}>
                {gamesState.data && (
                    <div
                        className={
                            "flex flex-col items-center justify-center text-center bg-surface p-4 rounded-md text-on-surface gap-2"
                        }
                    >
                        <h4
                            className={
                                "text-primary font-bold md:text-xl text-md"
                            }
                        >
                            Top Game
                        </h4>
                        <p className={"text-sm md:text-lg"}>
                            {gamesState.data[0].title}
                        </p>
                    </div>
                )}

                <div
                    className={
                        "flex flex-col items-center justify-center text-center bg-surface p-4 rounded-md text-on-surface gap-2"
                    }
                >
                    <h4 className={"text-primary font-bold md:text-xl text-md"}>
                        Top This Week
                    </h4>
                    <p className={"text-sm md:text-lg"}>Elden Ring</p>
                </div>

                <div
                    className={
                        "flex flex-col items-center text-center bg-surface p-4 rounded-md text-on-surface gap-2"
                    }
                >
                    <h4 className={"text-primary font-bold md:text-xl text-md"}>
                        Total Time
                    </h4>
                    <p className={"text-sm md:text-lg"}>300h30m</p>
                </div>

                <div
                    className={
                        "flex flex-col items-center text-center bg-surface p-4 rounded-md text-on-surface gap-2"
                    }
                >
                    <h4 className={"text-primary font-bold md:text-xl text-md"}>
                        This Week
                    </h4>
                    <p className={"text-sm md:text-lg"}>12h30m</p>
                </div>
            </div>

            <div className={"w-full xl:flex xl:justify-between"}>
                <div className="w-full h-full md:h-[400px]">
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
