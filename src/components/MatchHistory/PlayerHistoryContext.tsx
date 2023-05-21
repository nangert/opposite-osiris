import type { Match } from "@components/Interfaces";
import { Dispatch, SetStateAction, createContext } from "react";

type ContextProps = {
    username: string;
    setUsername?: Dispatch<SetStateAction<string>>;
    history?: Match[];
    setHistory?: Dispatch<SetStateAction<Match[]>>;
};

export const PlayerHistoryContext = createContext<ContextProps>({
    username: "",
    setUsername: () => "",
    history: [],
    setHistory: () => [],
});
