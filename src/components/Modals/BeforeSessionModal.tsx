import { useCurrentGameContext } from "../../context/CurrentGameContext";
import useGames from "../../hooks/useGames";
import useMoodMapper from "../../hooks/useMoodMapper";
import { useFeedbackContext } from "../../context/FeedbackContext";
import { FeedbackSection } from "../FeedbackSection";
import GameSelectionSection from "../GameSelectionSection";
import BaseSessionModal from "./BaseSessionModal";

interface Props {
    onClose: () => void;
    onStart: () => void;
}

export default function BeforeSessionModal({ onClose, onStart }: Props) {
    const { getMoodIcon, getMoodText } = useMoodMapper();
    const { gamesState, addGame } = useGames();
    const { currentGame, setCurrentGame } = useCurrentGameContext();
    const { beforeFeedback, setBeforeFeedback } = useFeedbackContext();

    const moodBefore = beforeFeedback?.mood_before ?? 3;
    const journalBefore = beforeFeedback?.journal_before ?? "";

    const handleGameChange = (gameId: string) => {
        const game = gamesState.data?.find((g) => g.id === gameId) || null;
        setCurrentGame(game);
    };

    const handleAddNewGame = async (title: string) => {
        await addGame({ title });
    };

    return (
        <BaseSessionModal
            isOpen={true}
            onClose={onClose}
            onSubmit={onStart}
            title={"Before You Start"}
            submitText={"Start Session"}
            isSubmitDisabled={!currentGame}
        >
            <GameSelectionSection
                games={gamesState.data || []}
                currentGameId={currentGame?.id || null}
                onGameChange={handleGameChange}
                onAddGame={handleAddNewGame}
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
