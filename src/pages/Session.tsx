import { useState } from "react";
import MoreIcon from "../assets/icons/MoreIcon";
import Header from "../components/Header";
import Icon from "../components/Icon";
import SessionList from "../components/Session/SessionList";
import SessionTracker from "../components/Session/SessionTracker";
import { ISession } from "../lib/types/sessions";

export default function Session() {
    const gameTitles = [
        "Monster Hunter World",
        "Elden Ring",
        "Dark Souls 3",
        "Sekiro: Shadows Die Twice",
        "The Witcher 3",
        "Bloodborne",
        "Ghost of Tsushima",
        "Final Fantasy 7 Remake",
        "Hollow Knight",
        "Nioh 2",
        "Dark Souls 2",
        "Demon's Souls",
        "Persona 5 Royal",
        "Cyberpunk 2077",
        "Metal Gear Solid V",
        "Red Dead Redemption 2",
        "God of War",
        "Horizon Zero Dawn",
        "Resident Evil 4 Remake",
        "Dead Space Remake",
        "The Last of Us Part II",
        "Doom Eternal",
        "Divinity: Original Sin 2",
        "Baldur's Gate 3",
        "Xenoblade Chronicles 3",
        "Star Wars Jedi: Survivor",
        "Death Stranding",
        "Shadow of the Colossus",
        "Control",
        "Alan Wake 2",
        "Returnal",
        "Metroid Dread",
        "Celeste",
        "Inside",
        "Limbo",
        "Cuphead",
        "Hades",
        "Dead Cells",
        "Slay the Spire",
        "The Binding of Isaac",
        "Disco Elysium",
        "Fire Emblem: Three Houses",
        "Tunic",
        "Hyper Light Drifter",
        "Transistor",
        "Nier: Automata",
        "Nier Replicant",
        "The Outer Wilds",
        "The Outer Worlds",
        "No Man's Sky",
        "Stardew Valley",
        "Terraria",
        "Factorio",
        "RimWorld",
        "Frostpunk",
        "They Are Billions",
        "Age of Empires IV",
        "Civilization VI",
        "Total War: Warhammer 3",
        "Warframe",
        "Path of Exile",
        "Diablo IV",
        "Guild Wars 2",
        "Final Fantasy XIV",
        "Monster Hunter Rise",
        "Genshin Impact",
        "Lost Ark",
        "Valheim",
        "Deep Rock Galactic",
        "Vampire Survivors",
        "Loop Hero",
        "Inscryption",
        "FTL: Faster Than Light",
        "StarCraft II",
        "Warcraft III",
        "Command & Conquer Remastered",
        "Halo Infinite",
        "Titanfall 2",
        "Call of Duty: Modern Warfare III",
        "Battlefield 2042",
        "Rainbow Six Siege",
        "Apex Legends",
        "Overwatch 2",
        "Team Fortress 2",
        "Counter-Strike 2",
        "League of Legends",
        "Dota 2",
        "Smite",
        "Rocket League",
        "Guilty Gear Strive",
        "Tekken 8",
        "Street Fighter 6",
        "Mortal Kombat 1",
        "Soulcalibur VI",
        "Granblue Fantasy Versus",
        "Dragon Ball FighterZ",
        "BlazBlue: Cross Tag Battle",
        "King of Fighters XV",
    ];

    const generateSessions = () => {
        return Array.from({ length: 100 }, (_, i) => {
            const now = Date.now() - i * 7200000;
            return {
                id: (i + 1).toString(),
                user_id: "user123",
                game_id: gameTitles[i % gameTitles.length],
                start_time: new Date(now).toISOString(),
                end_time: new Date(now + 3600000).toISOString(),
                duration_minutes: 60,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        });
    };

    const [sessions] = useState<ISession[]>(generateSessions());

    return (
        <div className={"flex w-full h-full gap-8"}>
            <div className={"basis-3/5 h-full flex flex-col justify-between"}>
                <Header header={"Session"}>
                    <Icon size={"medium"}>
                        <MoreIcon />
                    </Icon>
                </Header>
                <SessionTracker />
                <div></div>
            </div>
            <div
                className={
                    "basis-2/5 h-full flex flex-col border-l-2 border-outline px-8 gap-4"
                }
            >
                <Header header={"History"} />
                <div className={"overflow-y-auto h-[calc(100%-45px)]"}>
                    <SessionList sessions={sessions} />
                </div>
            </div>
        </div>
    );
}
