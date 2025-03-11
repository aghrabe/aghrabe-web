export default function HomeIcon() {
    return (
        <svg
            xmlns={"http://www.w3.org/2000/svg"}
            viewBox={"0 0 24 24"}
            fill={"none"}
            stroke={"currentColor"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            className="w-full h-full"
            strokeWidth={"2"}
            //style={"--darkreader-inline-stroke: currentColor;"}
        >
            <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>
            <path d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}></path>
            <path d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}></path>
        </svg>
    );
}
