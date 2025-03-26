import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { IGame } from "../lib/types/games";
import useQuery from "./useQuery";
import {
    getAllGamesService,
    getSingleGameService,
    addGameService,
    updateGameService,
} from "../services/gameService";

export default function useGames() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getAllGames = useCallback(async (): Promise<Array<IGame>> => {
        if (!user?.id) return [];
        const [data, error] = await getAllGamesService(user.id);
        if (error) {
            setErrorMessage(error.message);
            return [];
        }
        return data!;
    }, [user?.id]);

    const { state: gamesState, refetch } = useQuery<Array<IGame>>(
        `games.${user?.id}`,
        getAllGames,
        10 * 60 * 1000, // 10 min
    );

    const getSingleGame = useCallback(
        async (gameId: string): Promise<IGame | null> => {
            const [data, error] = await getSingleGameService(gameId);
            if (error) {
                setErrorMessage(error.message);
                return null;
            }
            return data || null;
        },
        [],
    );

    const addGame = useCallback(
        async (newGame: Partial<IGame>): Promise<void> => {
            if (!user?.id) return;
            const [, error] = await addGameService(user.id, newGame);
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
            }
        },
        [refetch, user?.id],
    );

    const updateGame = useCallback(
        async (
            gameId: string,
            updatedFields: Partial<IGame>,
        ): Promise<void> => {
            if (!user?.id) return;
            const [, error] = await updateGameService(gameId, updatedFields);
            if (error) {
                setErrorMessage(error.message);
            } else {
                refetch(true);
            }
        },
        [refetch, user?.id],
    );

    return {
        gamesState,
        errorMessage,
        getSingleGame,
        addGame,
        updateGame,
    };
}
