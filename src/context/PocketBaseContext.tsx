import ContextGenerator from "./ContextGenerator";
import PocketBase from "pocketbase";

const { Provider: PocketBaseProvider, useContextValue: usePocketBaseContext } =
    ContextGenerator<PocketBase>("PocketBase");

export { PocketBaseProvider, usePocketBaseContext };
