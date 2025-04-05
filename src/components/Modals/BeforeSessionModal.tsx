import { useState } from "react";
import { useCurrentGameContext } from "../../context/CurrentGameContext";
import useGames from "../../hooks/useGames";
import useMoodMapper from "../../hooks/useMoodMapper";
import { useFeedbackContext } from "../../context/FeedbackContext";
import { FeedbackSection } from "../FeedbackSection";
import GameSelectionSection from "../GameSelectionSection";
import BaseSessionModal from "./BaseSessionModal";
import useSettings from "../../hooks/useSettings";

interface Props {
    onClose: () => void;
    onStart: () => void;
}

export default function BeforeSessionModal({ onClose, onStart }: Props) {
    const { getMoodIcon, getMoodText } = useMoodMapper();
    const { gamesState, addGame } = useGames();
    const { settingsState } = useSettings();
    const { currentGame, setCurrentGame } = useCurrentGameContext();
    const { beforeFeedback, setBeforeFeedback } = useFeedbackContext();
    const [gameError, setGameError] = useState<string | undefined>(undefined);

    const moodBefore = beforeFeedback?.mood_before ?? 3;
    const journalBefore = beforeFeedback?.journal_before ?? "";

    const handleGameChange = (gameId: string) => {
        const game = gamesState.data?.find((g) => g.id === gameId) || null;
        setCurrentGame(game);
        setGameError(undefined);
    };

    const handleAddNewGame = async (title: string) => {
        await addGame({ title });
    };

    const handleStartSession = () => {
        if (!currentGame) {
            setGameError("Please select a game before starting");
            return;
        }

        if (!settingsState.data) {
            setGameError("No Settings loaded.");
            return;
        }

        const dailyLimit = settingsState.data.daily_limit_minutes;

        if (currentGame.time_spent_today_minutes >= dailyLimit) {
            setGameError(
                "Daily session limit reached. Please try again tomorrow.",
            );
            return;
        }
        onStart();
    };

    return (
        <BaseSessionModal
            isOpen={true}
            onClose={onClose}
            onSubmit={handleStartSession}
            title={"Before You Start"}
            submitText={"Start Session"}
            isSubmitDisabled={false}
        >
            <GameSelectionSection
                games={gamesState.data || []}
                currentGameId={currentGame?.id || null}
                onGameChange={handleGameChange}
                onAddGame={handleAddNewGame}
                error={gameError}
            />

            <FeedbackSection
                label={"How do you feel before playing?"}
                moodValue={moodBefore}
                onMoodChange={(newMood) =>
                    setBeforeFeedback({
                        mood_before: newMood,
                        journal_before: journalBefore,
                    })
                }
                journalValue={journalBefore}
                onJournalChange={(text) =>
                    setBeforeFeedback({
                        mood_before: moodBefore,
                        journal_before: text,
                    })
                }
                getMoodIcon={getMoodIcon}
                getMoodText={getMoodText}
            />
        </BaseSessionModal>
    );
}
