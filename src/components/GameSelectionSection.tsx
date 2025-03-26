import { Gamepad2Icon as GameController2, Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import Button from "./Button";

interface GameSelectionSectionProps {
    games: Array<{ id: string; title: string }>;
    currentGameId: string | null;
    onGameChange: (gameId: string) => void;
    onAddGame: (title: string) => Promise<void>;
}

export default function GameSelectionSection({
    games,
    currentGameId,
    onGameChange,
    onAddGame,
}: GameSelectionSectionProps) {
    const [isAddingNewGame, setIsAddingNewGame] = useState<boolean>(false);
    const [newGameTitle, setNewGameTitle] = useState<string>("");

    const handleGameChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const gameId = e.target.value;
        if (gameId === "add-new") {
            setIsAddingNewGame(true);
            return;
        }
        onGameChange(gameId);
    };

    const handleAddNewGame = async () => {
        if (!newGameTitle.trim()) return;
        await onAddGame(newGameTitle.trim());
        setIsAddingNewGame(false);
        setNewGameTitle("");
    };

    return (
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
                            onChange={(e) => setNewGameTitle(e.target.value)}
                            placeholder={"Enter game title"}
                            className={
                                "flex-1 bg-background border border-outline rounded-md px-3 py-2 text-sm"
                            }
                            autoFocus
                        />
                        <div className={"w-full flex flex-row gap-2"}>
                            <Button
                                onClick={() => setIsAddingNewGame(false)}
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
                            value={currentGameId || ""}
                            onChange={handleGameChange}
                            className={
                                "flex-1 bg-background border border-outline rounded-md px-3 py-2 text-sm"
                            }
                        >
                            <option value={""} disabled>
                                Select a game
                            </option>
                            {games.map((game) => (
                                <option key={game.id} value={game.id}>
                                    {game.title}
                                </option>
                            ))}
                            <option value={"add-new"}>+ Add new game</option>
                        </select>
                        <Button
                            onClick={() => setIsAddingNewGame(true)}
                            variant={"outlined"}
                            size={"small"}
                        >
                            <Plus
                                className={"h-5 w-5 md:h-6 md:w-6 text-primary"}
                            />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
