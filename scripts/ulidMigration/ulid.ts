//import { createClient } from "@supabase/supabase-js";
//import { ulid } from "ulid";
//
//const supabase = createClient(
//    process.env.VITE_SUPABASE_URL!,
//    process.env.VITE_SUPABASE_ANON_KEY!,
//);
//
//async function migrateTableToULID(
//    table: string,
//    idField: string,
//    foreignTables: Array<{ table: string; column: string }>,
//) {
//    console.log("starting...");
//    await supabase.rpc("exec_sql", {
//        sql: `ALTER TABLE ${table} ADD COLUMN ulid TEXT UNIQUE;`,
//    });
//    console.log("after supabse.rpc");
//
//    const { data: rows } = await supabase.from(table).select(idField);
//    if (!rows) throw new Error(`Failed to fetch rows from ${table}`);
//
//    for (const row of rows) {
//        const newULID = ulid();
//        const oldId = row[idField];
//
//        await supabase.from(table).update({ ulid: newULID }).eq(idField, oldId);
//    }
//
//    for (const { table: fkTable, column } of foreignTables) {
//        await supabase.rpc("exec_sql", {
//            sql: `ALTER TABLE ${fkTable} ADD COLUMN ${column}_ulid TEXT;`,
//        });
//
//        await supabase.rpc("exec_sql", {
//            sql: `
//                UPDATE ${fkTable}
//                SET ${column}_ulid = s.ulid
//                FROM ${table} s
//                WHERE ${fkTable}.${column} = s.${idField};
//            `,
//        });
//    }
//
//    console.log(`Finished migrating ${table}`);
//}
//
//console.log("before migrate call");
//(async () => {
//    await migrateTableToULID("games", "id", [
//        { table: "sessions", column: "game_id" },
//        { table: "session_feedbacks", column: "game_id" },
//        { table: "logs", column: "game_id" },
//    ]);
//})();
