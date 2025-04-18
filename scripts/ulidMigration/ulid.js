"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var ulid_1 = require("ulid");
try {
    var supabase_1 = (0, supabase_js_1.createClient)(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    function migrateTableToULID(table, idField, foreignTables) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, _i, rows_1, row, newULID, oldId, _a, foreignTables_1, _b, fkTable, column;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("starting...");
                        return [4 /*yield*/, supabase_1.rpc("exec_sql", {
                                sql: "ALTER TABLE ".concat(table, " ADD COLUMN ulid TEXT UNIQUE;"),
                            })];
                    case 1:
                        _c.sent();
                        console.log("after supabse.rpc");
                        return [4 /*yield*/, supabase_1.from(table).select(idField)];
                    case 2:
                        rows = (_c.sent()).data;
                        if (!rows)
                            throw new Error("Failed to fetch rows from ".concat(table));
                        _i = 0, rows_1 = rows;
                        _c.label = 3;
                    case 3:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 6];
                        row = rows_1[_i];
                        newULID = (0, ulid_1.ulid)();
                        oldId = row[idField];
                        return [4 /*yield*/, supabase_1
                                .from(table)
                                .update({ ulid: newULID })
                                .eq(idField, oldId)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        _a = 0, foreignTables_1 = foreignTables;
                        _c.label = 7;
                    case 7:
                        if (!(_a < foreignTables_1.length)) return [3 /*break*/, 11];
                        _b = foreignTables_1[_a], fkTable = _b.table, column = _b.column;
                        return [4 /*yield*/, supabase_1.rpc("exec_sql", {
                                sql: "ALTER TABLE ".concat(fkTable, " ADD COLUMN ").concat(column, "_ulid TEXT;"),
                            })];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, supabase_1.rpc("exec_sql", {
                                sql: "\n                UPDATE ".concat(fkTable, "\n                SET ").concat(column, "_ulid = s.ulid\n                FROM ").concat(table, " s\n                WHERE ").concat(fkTable, ".").concat(column, " = s.").concat(idField, ";\n            "),
                            })];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        _a++;
                        return [3 /*break*/, 7];
                    case 11:
                        console.log("Finished migrating ".concat(table));
                        return [2 /*return*/];
                }
            });
        });
    }
    console.log("before migrate call");
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, migrateTableToULID("games", "id", [
                        { table: "sessions", column: "game_id" },
                        { table: "session_feedbacks", column: "game_id" },
                        { table: "logs", column: "game_id" },
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })();
}
catch (error) {
    console.log(error);
}
