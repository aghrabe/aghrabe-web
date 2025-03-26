import { NotebookText } from "lucide-react";
import { MoodSelector } from "./MoodSelector";

interface FeedbackSectionProps {
    label: string;
    moodValue: number;
    onMoodChange: (mood: number) => void;
    journalValue: string;
    onJournalChange: (text: string) => void;
    getMoodIcon: (mood: number) => React.ReactNode;
    getMoodText: (mood: number) => string;
}

export function FeedbackSection({
    label,
    moodValue,
    onMoodChange,
    journalValue,
    onJournalChange,
    getMoodIcon,
    getMoodText,
}: FeedbackSectionProps) {
    return (
        <div
            className={
                "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
            }
        >
            <MoodSelector
                label={label}
                value={moodValue}
                onChange={onMoodChange}
                getMoodIcon={getMoodIcon}
                getMoodText={getMoodText}
            />
            <div className={"py-2"}>
                <div className={"flex gap-3"}>
                    <NotebookText
                        className={"h-5 w-5 md:h-6 md:w-6 text-primary"}
                    />
                    <p className={"text-sm md:text-base font-medium mb-2"}>
                        Notes {label.toLowerCase()}
                    </p>
                </div>
                <textarea
                    value={journalValue}
                    onChange={(e) => onJournalChange(e.target.value)}
                    placeholder={`How are you feeling ${label.toLowerCase()}? (optional)`}
                    className={
                        "w-full min-h-[80px] bg-background border border-outline rounded-md px-3 py-2 text-sm"
                    }
                />
            </div>
        </div>
    );
}
