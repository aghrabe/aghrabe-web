import { createContext, ReactNode, useContext } from "react";

interface ProviderProps<T> {
    value: T;
    children: ReactNode;
}

export default function ContextGenerator<T>(contextName: string) {
    const Context = createContext<T | undefined>(undefined);
    Context.displayName = `${contextName}Context`;

    function Provider({ value, children }: ProviderProps<T>) {
        return <Context.Provider value={value}>{children}</Context.Provider>;
    }
    Provider.displayName = `${contextName}Provider`;

    function useContextValue(): T {
        const context = useContext(Context);

        if (!context) {
            throw new Error(
                `use${contextName} must be used within a ${contextName}Provider`,
            );
        }

        return context;
    }

    return { Provider, useContextValue };
}
