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
                    <StatCard
                        title={"Top Game"}
                        value={gamesState.data[0].title}
                    />
                )}
                <StatCard title={"Top This Week"} value={"Elden Ring"} />
                <StatCard title={"Total Time"} value={"300h30m"} />
                <StatCard title={"This Week"} value={"12h30m"} />
            </div>

            <div className={"w-full xl:flex xl:justify-between"}>
                <div className="chart-container w-full h-[40vh] md:h-[400px]">
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
