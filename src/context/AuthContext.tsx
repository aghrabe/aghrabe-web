import { useEffect, useState } from "react";

import { User } from "../types/auth";
import { ContextProviderProps } from "../types/context";
import ContextGenerator from "./ContextGenerator";
import { usePocketBaseContext } from "./PocketBaseContext";

interface IAuthContext {
    user: User | null;
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
    const pb = usePocketBaseContext();
    const [user, setUser] = useState<User | null>(pb.authStore.record as User);

    useEffect(() => {
        const unsubscribe = pb.authStore.onChange(() => {
            setUser(pb.authStore.record as User);
        });

        return unsubscribe;
    }, [pb.authStore]);

    async function login(email: string, password: string) {
        await pb.collection("users").authWithPassword(email, password);
        setUser(pb.authStore.record as User);
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
