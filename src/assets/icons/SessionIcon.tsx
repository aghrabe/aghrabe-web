export default function SessionIcon() {
    return (
        <svg
            xmlns={"http://www.w3.org/2000/svg"}
            viewBox={"0 0 24 24"}
            fill={"none"}
            stroke={"currentColor"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            className={"w-full h-full"}
            strokeWidth={"2"}
            //style={"--darkreader-inline-stroke: currentColor;"}
        >
            <path d={"M6.5 7h11"}></path>
            <path
                d={
                    "M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z"
                }
            ></path>
            <path
                d={
                    "M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z"
                }
            ></path>
        </svg>
    );
}
