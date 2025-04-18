import supabase from "./supabaseClient";
import safeExecute from "../lib/utils/safeExecute";
import { IGame } from "../lib/types/games";

export async function getAllGamesService(
    userId: string,
): Promise<[Array<IGame> | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("games")
            .select("*")
            .eq("user_id", userId)
            .order("time_spent_total_minutes", { ascending: false });
        if (result.error) throw result.error;
        return result.data || [];
    });
}

export async function getSingleGameService(
    gameId: string,
): Promise<[IGame | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();
        if (result.error) throw result.error;
        return result.data;
    });
}

export async function addGameService(
    userId: string,
    newGame: Partial<IGame>,
): Promise<[void | null, Error | null]> {
    return await safeExecute(async () => {
        //
        //const id = ulid();
        //
        const result = await supabase
            .from("games")
            .insert({
                ...newGame,
                user_id: userId,
            })
            .single();
        if (result.error) throw result.error;
        return;
    });
}

export async function updateGameService(
    gameId: string,
    updatedFields: Partial<IGame>,
): Promise<[void | null, Error | null]> {
    return await safeExecute(async () => {
        const result = await supabase
            .from("games")
            .update(updatedFields)
            .eq("id", gameId);
        if (result.error) throw result.error;
        return;
    });
}
