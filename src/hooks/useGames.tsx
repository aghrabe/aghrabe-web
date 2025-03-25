import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import safeExecute from "../lib/utils/safeExecute";
import { IGame } from "../lib/types/games";
import supabase from "../services/supabaseClient";
import useQuery from "./useQuery";

export default function useGames() {
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getAllGames = useCallback(async (): Promise<Array<IGame>> => {
        const [data, error] = await safeExecute<Array<IGame>, Error>(
            async () => {
                const result = await supabase
                    .from("games")
                    .select("*")
                    .eq("user_id", user?.id)
                    .order("created_at", { ascending: false });
                if (result.error) throw result.error;
                return result.data || [];
            },
        );

        if (error) setErrorMessage(error.message);
        return data!;
    }, [user?.id]);

    const { state: gamesState, refetch } = useQuery<Array<IGame>>(
        `games.${user?.id}`,
        getAllGames,
        10 * 60 * 1000, // 30 min
    );

    const getSingleGame = useCallback(
        async (gameId: string): Promise<IGame | null> => {
            const [data, error] = await safeExecute<IGame, Error>(async () => {
                const result = await supabase
                    .from("games")
                    .select("*")
                    .eq("id", gameId)
                    .single();
                if (result.error) throw result.error;
                return result.data;
            });
            if (error) setErrorMessage(error.message);
            return data || null;
        },
        [],
    );

    const addGame = useCallback(
        async (newGame: Partial<IGame>): Promise<void> => {
            if (!user?.id) return;
            const [, error] = await safeExecute<void, Error>(async () => {
                const result = await supabase
                    .from("games")
                    .insert({
                        ...newGame,
                        user_id: user.id,
                    })
                    .single();
                if (result.error) throw result.error;
            });
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
            const [, error] = await safeExecute<void, Error>(async () => {
                const result = await supabase
                    .from("games")
                    .update(updatedFields)
                    .eq("id", gameId);
                if (result.error) throw result.error;
            });
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
