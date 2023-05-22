import { useContext, useEffect, useState } from "react";
import type { Match, Player } from "../Interfaces";
import { PlayerHistoryContext } from "../PlayerHistoryContext";
import "./MatchHistory.css";
import PlayerStats from "./PlayerStats";
import "./PlayerRoot.css";
import MatchHistory from "./MatchHistory";
import CustomButton from "@components/CustomComponents/CustomButton";

//ChangeImport
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
//import { createClient } from "@supabase/supabase-js";

const fuseOptions = {
    keys: ["opponent_username"],
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

const matchHistoryStart = "https://api.duelyst2.com/api/users/";
const matchHistoryEnd = "/games?len=9999&blatmmr=true";

const tokenRanks =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkIjp7ImlkIjoiLU5UNFhVSlF4dnlpcTRsMEx1djMiLCJlbWFpbCI6ImR1ZWx5c3RyYW5rc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImR1ZWx5c3RyYW5rcyJ9LCJ2IjowLCJpYXQiOjE2ODM1Nzk0NTAsImV4cCI6MTY4NDc4OTA1MH0.NrjfwlD8A8pRfF8GtVBx2exPKHj2-Ec-_MS7IocUBok";
const token = tokenRanks;

const PlayerRoot = () => {
    const { username, setUsername, history, setHistory, loading, setLoading, showHistory, setShowHistory } = useContext(PlayerHistoryContext);

    const [currPlayer, setCurrPlayer] = useState<Player | undefined>(undefined);
    const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
    const supabase = createClient(dbUrl, anonKey);

    const historyLabel = "Show match history";
    const statsLabel = "Show player stats";

    const fetchplayer = async (username: string) => {
        return await supabase.from("players").select("username, user_id").eq("username", username);
    };

    useEffect(() => {
        const fetchAndSetPlayer = async () => {
            const playerDB = await fetchplayer(username);
            if (playerDB.data) {
                setCurrPlayer(playerDB.data[0]);
            }
        };
        fetchAndSetPlayer();
    }, [username]);

    useEffect(() => {
        const fetchItems = async () => {
            const url = matchHistoryStart + currPlayer?.user_id.trim() + matchHistoryEnd;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data: Match[] = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };

        if (currPlayer !== null && currPlayer !== undefined) {
            fetchItems();
        }
    }, [tokenRanks, matchHistoryStart, matchHistoryEnd, currPlayer]);

    useEffect(() => {
        if (history.length > 0) {
            setLoading(false);
        }
    }, [history]);

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <>
            <div id="Header">
                <div id="Username">{username}</div>

                <CustomButton onClick={() => setShowHistory(!showHistory)} id="TabsButton">
                    {showHistory ? statsLabel : historyLabel}
                </CustomButton>
            </div>

            {showHistory && <MatchHistory />}

            {!showHistory && <PlayerStats />}
        </>
    );
};

export default PlayerRoot;
