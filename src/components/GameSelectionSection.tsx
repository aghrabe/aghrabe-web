import { Gamepad2Icon as GameController2, Plus, Search, X } from "lucide-react";
import { type ChangeEvent, useState, useEffect, useRef } from "react";
import Button from "./Button";
import FormErrorSection from "./FormErrorSection";

interface GameSelectionSectionProps {
    games: Array<{ id: string; title: string }>;
    currentGameId: string | null;
    onGameChange: (gameId: string) => void;
    onAddGame: (title: string) => Promise<void>;
    error?: string;
}

export default function GameSelectionSection({
    games,
    currentGameId,
    onGameChange,
    onAddGame,
    error,
}: GameSelectionSectionProps) {
    const [isAddingNewGame, setIsAddingNewGame] = useState<boolean>(false);
    const [newGameTitle, setNewGameTitle] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredGames, setFilteredGames] =
        useState<Array<{ id: string; title: string }>>(games);
    const [showResults, setShowResults] = useState<boolean>(false);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentGame = games.find((game) => game.id === currentGameId);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredGames(games);
            return;
        }

        const filtered = games.filter((game) =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredGames(filtered);
    }, [searchQuery, games]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowResults(true);
    };

    const handleGameSelect = (gameId: string) => {
        onGameChange(gameId);
        setShowResults(false);
        setSearchQuery(games.find((game) => game.id === gameId)?.title || "");
    };

    const handleAddNewGame = async () => {
        const title = isAddingNewGame
            ? newGameTitle.trim()
            : searchQuery.trim();
        if (!title) return;

        await onAddGame(title);
        setIsAddingNewGame(false);
        setNewGameTitle("");
        setSearchQuery("");
        setShowResults(false);
    };

    return (
        <div
            className={
                "space-y-2 md:space-y-4 rounded-lg border border-outline bg-card p-4"
            }
        >
            <div className={"flex items-center gap-3"}>
                <GameController2
                    className={"h-5 w-5 md:h-6 md:w-6 text-primary"}
                />
                <p className={"text-on-surface font-bold text-sm md:text-base"}>
                    What you want to play?
                </p>
            </div>

            {error && <FormErrorSection error={error} />}

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
                    <div className={"flex flex-col gap-2 mt-1 relative"}>
                        <div className={"relative"}>
                            <input
                                ref={searchInputRef}
                                type={"text"}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowResults(true)}
                                placeholder={
                                    currentGame
                                        ? currentGame.title
                                        : "Search for a game"
                                }
                                className={`w-full bg-background border rounded-md px-9 py-2 text-sm md:text-base placeholder:text-outline-variant ${error
                                        ? "border-error focus:ring-error"
                                        : "border-outline focus:ring-primary"
                                    }`}
                            />
                            <Search
                                className={
                                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-outline-variant"
                                }
                            />
                            {searchQuery && (
                                <button
                                    type={"button"}
                                    onClick={() => {
                                        setSearchQuery("");
                                        setShowResults(true);
                                        searchInputRef.current?.focus();
                                    }}
                                    className={
                                        "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-outline-variant hover:text-foreground"
                                    }
                                    aria-label={"Clear search"}
                                >
                                    <X className={"h-4 w-4"} />
                                </button>
                            )}
                        </div>

                        {showResults && (
                            <div
                                ref={searchResultsRef}
                                className={
                                    "absolute top-1/2 left-0 right-0 bg-background border border-outline rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
                                }
                            >
                                {filteredGames.length > 0 ? (
                                    <div className={"py-1"}>
                                        {filteredGames.map((game) => (
                                            <div
                                                key={game.id}
                                                onClick={() =>
                                                    handleGameSelect(game.id)
                                                }
                                                className={`px-3 py-2 cursor-pointer hover:bg-muted text-sm ${currentGameId === game.id
                                                        ? "bg-primary/10 font-medium"
                                                        : ""
                                                    }`}
                                            >
                                                {game.title}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {searchQuery.trim() && (
                                    <div
                                        className={
                                            "px-3 py-2 cursor-pointer hover:bg-primary/10 text-sm border-t border-outline flex items-center gap-2 text-primary"
                                        }
                                        onClick={() => {
                                            setNewGameTitle(searchQuery);
                                            setIsAddingNewGame(true);
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add `{searchQuery.trim()}`</span>
                                    </div>
                                )}

                                {filteredGames.length === 0 &&
                                    !searchQuery.trim() && (
                                        <div
                                            className={
                                                "px-3 py-2 text-sm text-on-background"
                                            }
                                        >
                                            No games found. Start typing to
                                            search.
                                        </div>
                                    )}
                            </div>
                        )}

                        <Button
                            onClick={() => setIsAddingNewGame(true)}
                            variant="outlined"
                            size="small"
                        >
                            <Plus
                                className={"h-5 w-5 md:h-5 md:w-5 text-primary"}
                            />
                            <span className={"ml-1"}>Add new game</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
