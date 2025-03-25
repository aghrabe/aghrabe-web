import { useState } from "react";
import ContextGenerator from "./ContextGenerator";
import type { IGame } from "../lib/types/games";

interface CurrentGameContextType {
    currentGame: IGame | null;
    setCurrentGame: (game: IGame | null) => void;
}

const { Provider, useContextValue: useCurrentGameContext } =
    ContextGenerator<CurrentGameContextType>("CurrentGame");

export function CurrentGameProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentGame, setCurrentGame] = useState<IGame | null>(null);

    return (
        <Provider value={{ currentGame, setCurrentGame }}>{children}</Provider>
    );
}

export { useCurrentGameContext };
