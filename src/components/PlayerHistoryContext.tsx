import type { Match } from "@components/Interfaces";
import { Dispatch, SetStateAction, createContext } from "react";

type ContextProps = {
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    history: Match[];
    setHistory: Dispatch<SetStateAction<Match[]>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    showHistory: boolean;
    setShowHistory: Dispatch<SetStateAction<boolean>>;
    token: string;
    anonKey: string;
    dbUrl: string;
};

export const PlayerHistoryContext = createContext<ContextProps>({
    username: "",
    setUsername: () => "",
    history: [],
    setHistory: () => {},
    loading: false,
    setLoading: () => {},
    showHistory: true,
    setShowHistory: () => {},
    token: "",
    anonKey: "",
    dbUrl: "",
});
