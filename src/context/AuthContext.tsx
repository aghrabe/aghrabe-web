import { useState } from "react";
import { AuthType } from "../types/auth";
import { ContextProviderProps } from "../types/context";
import ContextGenerator from "./ContextGenerator";

interface IAuthContext {
    authType: AuthType;
    setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
}

const { Provider, useContextValue: useAuthContext } =
    ContextGenerator<IAuthContext>("AuthContext");

export default function AuthProvider({ children }: ContextProviderProps) {
    const [authType, setAuthType] = useState<AuthType>("login");

    return (
        <Provider
            value={{
                authType,
                setAuthType,
            }}
        >
            {children}
        </Provider>
    );
}

export { useAuthContext };
