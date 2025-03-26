import {
    Brain,
    Gamepad2Icon as GameController2,
    NotebookText,
    Plus,
} from "lucide-react";
import { useState } from "react";
import { useCurrentGameContext } from "../../context/CurrentGameContext";
import useGames from "../../hooks/useGames";
import useMoodMapper from "../../hooks/useMoodMapper";
import Button from "../Button";
import Modal from "./Modal";

interface Props {
    onClose: () => void;
    onStart: () => void;
}

export default function BeforeSessionModal({ onClose, onStart }: Props) {
    const { getMoodIcon, getMoodText } = useMoodMapper();
    const { gamesState, addGame } = useGames();
    const { currentGame, setCurrentGame } = useCurrentGameContext();
    const [moodBefore, setMoodBefore] = useState<number>(3);
    const [journalBefore, setJournalBefore] = useState<string>("");
    const [isAddingNewGame, setIsAddingNewGame] = useState<boolean>(false);
    const [newGameTitle, setNewGameTitle] = useState<string>("");

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
                                    className={`${isActive ? "opacity-100" : "opacity-0"} text-center text-xs md:text-sm`}
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

    const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const gameId = e.target.value;

        if (gameId === "add-new") {
            setIsAddingNewGame(true);
            return;
        }

        const game = gamesState.data?.find((g) => g.id === gameId) || null;
        setCurrentGame(game);
    };

    const handleAddNewGame = async () => {
        if (!newGameTitle.trim()) return;

        await addGame({ title: newGameTitle.trim() });
        setIsAddingNewGame(false);
        setNewGameTitle("");

        // The game list will be refreshed by the addGame function
        // We'll select the new game in the next render when it's available
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
                        Before You Start
                    </h2>
                </div>

                <div className={"space-y-4 md:space-y-6"}>
                    <div
                        className={
                            "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                        }
                    >
                        <div className={"flex items-center gap-3"}>
                            <GameController2
                                className={"h-5 w-5 md:h-6 md:w-6 text-primary"}
                            />
                            <p
                                className={
                                    "text-muted-foreground font-bold text-sm md:text-base"
                                }
                            >
                                What you want to play?
                            </p>
                        </div>
                        <div className={"flex-1"}>
                            {isAddingNewGame ? (
                                <div className={"flex flex-col gap-2 mt-1"}>
                                    <input
                                        type={"text"}
                                        value={newGameTitle}
                                        onChange={(e) =>
                                            setNewGameTitle(e.target.value)
                                        }
                                        placeholder={"Enter game title"}
                                        className={
                                            "flex-1 bg-background border border-outline rounded-md px-3 py-2 text-sm"
                                        }
                                        autoFocus
                                    />

                                    <div
                                        className={"w-full flex flex-row gap-2"}
                                    >
                                        <Button
                                            onClick={() =>
                                                setIsAddingNewGame(false)
                                            }
                                            variant={"outlined"}
                                            size={"small"}
                                            className={"basis-1/2"}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddNewGame}
                                            variant={"contained"}
                                            size={"small"}
                                            disabled={!newGameTitle.trim()}
                                            className={"basis-1/2"}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={"flex flex-col gap-2 mt-1"}>
                                    <select
                                        value={currentGame?.id || ""}
                                        onChange={handleGameChange}
                                        className={
                                            "flex-1 bg-background border border-outline rounded-md px-3 py-2 text-sm"
                                        }
                                    >
                                        <option value={""} disabled>
                                            Select a game
                                        </option>
                                        {gamesState.data?.map((game) => (
                                            <option
                                                key={game.id}
                                                value={game.id}
                                            >
                                                {game.title}
                                            </option>
                                        ))}
                                        <option value={"add-new"}>
                                            + Add new game
                                        </option>
                                    </select>
                                    <Button
                                        onClick={() => setIsAddingNewGame(true)}
                                        variant={"outlined"}
                                        size={"small"}
                                    >
                                        <Plus
                                            className={
                                                "h-5 w-5 md:h-6 md:w-6 text-primary"
                                            }
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={
                            "space-y-3 md:space-y-4 rounded-lg border border-outline bg-card p-4"
                        }
                    >
                        {renderMoodSelector(
                            "How do you feel before playing?",
                            moodBefore,
                            setMoodBefore,
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
                                    Notes before session
                                </p>
                            </div>
                            <textarea
                                value={journalBefore}
                                onChange={(e) =>
                                    setJournalBefore(e.target.value)
                                }
                                placeholder={
                                    "How are you feeling before playing? (optional)"
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
                        Start Session
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
