import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
);

function parseSessions(markdown) {
    const sessions = [];
    const sessionBlocks = markdown.split("## Session ").slice(1);

    for (const block of sessionBlocks) {
        const parts = block.split("###");
        const sessionNumber = parts[0].trim();

        let journalBefore = "";
        let journalAfter = "";

        for (const part of parts) {
            if (part.startsWith("before")) {
                journalBefore = part.replace("before", "").trim();
            } else if (part.startsWith("after")) {
                journalAfter = part.replace("after", "").trim();
            }
        }

        const durationMatch = journalAfter.match(
            /played for (\d+(\.\d+)?) hours?/i,
        );
        const durationMinutes = durationMatch
            ? parseFloat(durationMatch[1]) * 60
            : 90;

        sessions.push({
            session_number: parseInt(sessionNumber),
            journal_before: journalBefore,
            journal_after: journalAfter,
            duration_minutes: Math.round(durationMinutes),
        });
    }

    return sessions;
}

async function getOrCreateGame() {
    const gameTitle = "Monster Hunter: World";

    const { data: existingGame, error: gameError } = await supabase
        .from("games")
        .select("id")
        .eq("title", gameTitle)
        .single();

    if (gameError && gameError.code !== "PGRST116") {
        console.error("Error fetching game:", gameError);
        return null;
    }

    if (existingGame) {
        console.log(`Game already exists: ${gameTitle}`);
        return existingGame.id;
    }

    const { data: newGame, error: insertError } = await supabase
        .from("games")
        .insert({
            title: gameTitle,
            platform: "PC",
        })
        .select("id")
        .single();

    if (insertError) {
        console.error("Error inserting game:", insertError);
        return null;
    }

    console.log(`Inserted game: ${gameTitle}`);
    return newGame.id;
}

function getRandomMood() {
    return Math.floor(Math.random() * 5) + 1;
}

function calculateTimes(durationMinutes) {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - durationMinutes * 60000);
    return {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
    };
}

async function migrate() {
    try {
        const markdown = fs.readFileSync("scripts/obsidian_logs.md", "utf8");
        const sessions = parseSessions(markdown);

        const gameId = await getOrCreateGame();
        if (!gameId) {
            console.error("Failed to retrieve game ID. Exiting migration.");
            return;
        }

        for (const session of sessions) {
            const { startTime, endTime } = calculateTimes(
                session.duration_minutes,
            );

            const { data: sessionData, error: sessionError } = await supabase
                .from("sessions")
                .insert({
                    user_id: process.env.VITE_USER_ID,
                    game_id: gameId,
                    start_time: startTime,
                    end_time: endTime,
                })
                .select("id")
                .single();

            if (sessionError) {
                console.error("Error inserting session:", sessionError);
                continue;
            }

            const { error: feedbackError } = await supabase
                .from("session_feedbacks")
                .insert({
                    user_id: process.env.VITE_USER_ID,
                    session_id: sessionData.id,
                    journal_before: session.journal_before,
                    journal_after: session.journal_after,
                    mood_before: getRandomMood(),
                    mood_after: getRandomMood(),
                });

            if (feedbackError) {
                console.error("Error inserting feedback:", feedbackError);
            }
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration error:", error);
    }
}

migrate();
