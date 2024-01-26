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

const matchHistoryStart = "https://api.duelyst2.com/api/users/";
const matchHistoryEnd = "/games?len=9999&blatmmr=true";

const PlayerRoot = () => {
    const { username, setUsername, history, setHistory, loading, setLoading, showHistory, setShowHistory, token, anonKey, dbUrl } =
        useContext(PlayerHistoryContext);

    const [error401, setError401] = useState(false);
    const [errorUserNotFount, setErrorUserNotFount] = useState(false);

    const [currPlayer, setCurrPlayer] = useState<Player | undefined>(undefined);
    const supabase = createClient(dbUrl, anonKey);

    const historyLabel = "Show match history";
    const statsLabel = "Show player stats";

    const fetchplayer = async (username: string) => {
        return await supabase.from("Users").select("username, user_id").eq("username", username);
    };

    useEffect(() => {
        const fetchAndSetPlayer = async () => {
            const playerDB = await fetchplayer(username);
            if (playerDB.data && playerDB.data?.length > 0) {
                setCurrPlayer(playerDB.data[0]);
            } else {
                setErrorUserNotFount(true);
                setLoading(false);
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
                if (response.status === 401) {
                    setLoading(false);
                    setError401(true);
                    return;
                }

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
    }, [token, matchHistoryStart, matchHistoryEnd, currPlayer]);

    useEffect(() => {
        if (history.length > 0) {
            setLoading(false);
        }
    }, [history]);

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error401) {
        return (
            <div>
                <div className="textLabel">
                    The account <b>{username}</b> is not yet on the friendslist.
                </div>
                <div className="textLabel">
                    Please add <b>duelystranks</b> in-game for the data to be available.
                </div>
            </div>
        );
    }

    if (errorUserNotFount) {
        return (
            <div>
                <div className="textLabel">
                    The account <b>{username}</b> is not yet in the player database.
                </div>
                <div className="textLabel">
                    Please message <b>Nangert#1024</b> on discord to get it added.
                </div>
            </div>
        );
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
