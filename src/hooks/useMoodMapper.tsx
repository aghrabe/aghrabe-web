import { Annoyed, Frown, Meh, Smile, SmilePlus } from "lucide-react";
import { ReactElement } from "react";

type Mood = 1 | 2 | 3 | 4 | 5;

export default function useMoodMapper() {
    const moodIcons: Record<Mood, ReactElement> = {
        1: <Frown className={"h-5 w-5 md:h-6 md:w-6 text-mood-red"} />,
        2: <Annoyed className={"h-5 w-5 md:h-6 md:w-6 text-mood-orange"} />,
        3: <Meh className={"h-5 w-5 md:h-6 md:w-6 text-mood-yellow"} />,
        4: <Smile className={"h-5 w-5 md:h-6 md:w-6 text-mood-blue"} />,
        5: <SmilePlus className={"h-5 w-5 md:h-6 md:w-6 text-mood-green"} />,
    };

    const moodTexts: Record<Mood, string> = {
        1: "Very Sad",
        2: "Sad",
        3: "Meh",
        4: "Happy",
        5: "Very Happy",
    };

    const getMoodIcon = (mood: number) => moodIcons[mood as Mood];
    const getMoodText = (mood: number) => moodTexts[mood as Mood];

    return { getMoodIcon, getMoodText };
}
