import type { Match } from "@components/Interfaces";
import { useState } from "react";
import { PlayerHistoryContext } from "../PlayerHistoryContext";
import PlayerRoot from "./PlayerRoot";

type MatchHistoryRootProps = {
    username: string;
    token: string;
};

const PlayerRootContext = (props: MatchHistoryRootProps) => {
    const [history, setHistory] = useState<Match[]>([]);
    const [username, setUsername] = useState<string>(props.username);
    const [loading, setLoading] = useState<boolean>(true);
    const [showHistory, setShowHistory] = useState<boolean>(true);
    const token = props.token;
    console.log(token);

    return (
        <>
            <PlayerHistoryContext.Provider value={{ username, setUsername, history, setHistory, loading, setLoading, showHistory, setShowHistory, token }}>
                <PlayerRoot />
            </PlayerHistoryContext.Provider>
        </>
    );
};

export default PlayerRootContext;
