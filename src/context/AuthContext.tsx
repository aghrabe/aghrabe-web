import PocketBase, { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { ContextProviderProps } from "../types/context";
import ContextGenerator from "./ContextGenerator";

const pb = new PocketBase("http://localhost:8090");

interface IAuthContext {
    user: RecordModel | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        passwordConfirm: string,
    ) => Promise<void>;
    logout: () => void;
}

const { Provider, useContextValue: useAuthContext } =
    ContextGenerator<IAuthContext>("AuthContext");

export default function AuthProvider({ children }: ContextProviderProps) {
    const [user, setUser] = useState(pb.authStore.record);

    useEffect(() => {
        const unsubscribe = pb.authStore.onChange(() => {
            setUser(pb.authStore.record);
        });

        return unsubscribe();
    }, []);

    async function login(email: string, password: string) {
        await pb.collection("users").authWithPassword(email, password);
        setUser(pb.authStore.record);
    }

    async function register(
        email: string,
        password: string,
        passwordConfirm: string,
    ) {
        await pb
            .collection("users")
            .create({ email, password, passwordConfirm });
        await login(email, password);
    }

    function logout() {
        pb.authStore.clear();
        setUser(null);
    }

    return (
        <Provider
            value={{
                user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </Provider>
    );
}

export { useAuthContext };
