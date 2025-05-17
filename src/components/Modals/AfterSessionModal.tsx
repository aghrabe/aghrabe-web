import { useEffect } from "react";
import { useCurrentGameContext } from "../../context/CurrentGameContext";
import { useFeedbackContext } from "../../context/FeedbackContext";
import useMoodMapper from "../../hooks/useMoodMapper";
import { FeedbackSection } from "../FeedbackSection";
import BaseSessionModal from "./BaseSessionModal";

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

    // TODO: make an entire notification hook that handles notification sound and pushes it to the device as well
    useEffect(() => {
        const notificationSound = new Audio("/sounds/mixkit-achievement-bell-600.mp3");
        notificationSound.play().catch((error) => {
            console.error("Failed to play notification sound:", error);
        });
    }, []);

    return (
        <BaseSessionModal
            isOpen={true}
            onClose={onClose}
            onSubmit={onStart}
            title={"Now That The Game is Finished"}
            submitText={"Finish Session"}
            isSubmitDisabled={!currentGame}
        >
            <FeedbackSection
                label={"How do you feel after playing?"}
                moodValue={moodAfter}
                onMoodChange={(newMood) =>
                    setAfterFeedback({
                        mood_after: newMood,
                        journal_after: journalAfter,
                    })
                }
                journalValue={journalAfter}
                onJournalChange={(text) =>
                    setAfterFeedback({
                        mood_after: moodAfter,
                        journal_after: text,
                    })
                }
                getMoodIcon={getMoodIcon}
                getMoodText={getMoodText}
            />
        </BaseSessionModal>
    );
}
