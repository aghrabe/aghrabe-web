import { Brain, NotebookText } from "lucide-react";
import { useCurrentGameContext } from "../../context/CurrentGameContext";
import { useFeedbackContext } from "../../context/FeedbackContext";
import useMoodMapper from "../../hooks/useMoodMapper";
import Button from "../Button";
import Modal from "./Modal";

interface Props {
    onClose: () => void;
    onStart: () => void;
}

export default function AfterSessionModal({ onClose, onStart }: Props) {
    const { getMoodIcon, getMoodText } = useMoodMapper();
    const { currentGame } = useCurrentGameContext();
    const { afterFeedback, setAfterFeedback } = useFeedbackContext();

    const moodAfter = afterFeedback?.mood_after ?? 3;
    const journalAfter = afterFeedback?.journal_after ?? "";

    function renderMoodSelector(
        label: string,
        value: number,
        onChange: (value: number) => void,
    ) {
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
                                    "min-w-16 sm:min-w-20 flex flex-col justify-center items-center gap-1 md:gap-2"
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
                                    className={`${
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

    const handleMoodChange = (newMood: number) => {
        setAfterFeedback({
            mood_after: newMood,
            journal_after: journalAfter,
        });
    };

    const handleJournalChange = (text: string) => {
        setAfterFeedback({
            mood_after: moodAfter,
            journal_after: text,
        });
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div
                className={
                    "max-h-[80vh] space-y-4 md:space-y-6 overflow-y-auto p-0 md:p-6"
                }
            >
                <div className={"flex items-center justify-between"}>
                    <h2 className={"text-xl md:text-2xl font-bold"}>
                        Now That The Game is finished
                    </h2>
                </div>

                <div className={"space-y-4 md:space-y-6"}>
                    <div
                        className={
                            "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                        }
                    >
                        {renderMoodSelector(
                            "How do you feel after playing?",
                            moodAfter,
                            handleMoodChange,
                        )}
                        <div className={"py-2"}>
                            <div className={"flex gap-3"}>
                                <NotebookText
                                    className={
                                        "h-5 w-5 md:h-6 md:w-6 text-primary"
                                    }
                                />
                                <p
                                    className={
                                        "text-sm md:text-base font-medium mb-2"
                                    }
                                >
                                    Notes after session
                                </p>
                            </div>
                            <textarea
                                value={journalAfter}
                                onChange={(e) =>
                                    handleJournalChange(e.target.value)
                                }
                                placeholder={
                                    "How are you feeling after playing? (optional)"
                                }
                                className={
                                    "w-full min-h-[80px] bg-background border border-outline rounded-md px-3 py-2 text-sm"
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className={"flex gap-2 mt-6"}>
                    <Button
                        onClick={onClose}
                        variant={"outlined"}
                        size={"small"}
                        fullWidth
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onStart}
                        variant={"contained"}
                        size={"small"}
                        fullWidth
                        disabled={!currentGame}
                    >
                        Finish Session
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
