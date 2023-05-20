import type { Match } from "@components/Interfaces";
import React from "react";

type ContextProps = {
    username: string;
    history: Match[];
};

export const PlayerHistoryContext = React.createContext({
    username: "",
    history: [] as Match[],
} as ContextProps);
