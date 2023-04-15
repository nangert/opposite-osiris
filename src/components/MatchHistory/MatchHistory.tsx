import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import "./MatchHistory.css";
import type { Match, Player } from "../Interfaces";
import MatchHistoryItem from "./MatchHistoryItem";
import { TextInput, Checkbox, Grid, Collapse, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface MatchHistoryProps {
    player: string;
}

const fuseOptions = {
    keys: ["opponent_username"],
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

//const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
// const matchHistoryStart = import.meta.env.SECRET_MATCH_HISTORY_START;
// const matchHistoryEnd = import.meta.env.SECRET_MATCH_HISTORY_END;
// const token = import.meta.env.SECRET_DUELYST_TOKEN;

const matchHistoryStart = "https://api.duelyst2.com/api/users/";
const matchHistoryEnd = "/games?len=3000&blatmmr=true";
const tokenRanks =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkIjp7ImlkIjoiLU5UNFhVSlF4dnlpcTRsMEx1djMiLCJlbWFpbCI6ImR1ZWx5c3RyYW5rc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImR1ZWx5c3RyYW5rcyJ9LCJ2IjowLCJpYXQiOjE2ODE1NzI2MjcsImV4cCI6MTY4Mjc4MjIyN30.RnmSiHrB8-i8JlStm4HjtrbG3OJnKcd-kkBaIDH_cRo";
const tokenNangert =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkIjp7ImlkIjoiLU5KVzE5QTFqdk95WGlWbi1XeTciLCJlbWFpbCI6ImFuZ2VydC5uaWtsYXNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJuYW5nZXJ0In0sInYiOjAsImlhdCI6MTY4MTU3MTcxNywiZXhwIjoxNjgyNzgxMzE3fQ.G9ly6QNn_I7Enjlq-0Q1N8T3tQKoFaqjMC9lOtqM1Kc";

const MatchHistory: React.FC<MatchHistoryProps> = ({ player }) => {
    //#region  useState
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [query, setQuery] = useState("");
    const [matches, setMatches] = useState([] as Match[]);
    const [currPlayer, setCurrPlayer] = useState<Player | undefined>(undefined);

    const [filtersOpen, { toggle }] = useDisclosure(false);

    const [onlyWins, setOnlyWins] = useState(false);
    const [onlyLosses, setOnlyLosses] = useState(false);

    const [youFactions, setYouFactions] = useState([] as number[]);
    const [oppFactions, setOppFactions] = useState([] as number[]);

    const [gameModes, setGameModes] = useState(["ranked", "gauntlet"] as string[]);

    const [filtered, setFiltered] = useState([] as Match[]);

    const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
    const supabase = createClient(dbUrl, anonKey);

    //#endregion

    //const pool = new postgres.Pool(databaseUrl, 3, true);

    const fuse = new Fuse(matches, fuseOptions);

    const posts = fuse.search(query).map(result => result.item);

    //#region Filter

    const handleSearch = (event: any) => {
        setQuery(event.target.value);
    };

    const toggleGameMode = (mode: string) => {
        gameModes.includes(mode) ? setGameModes(gameModes.filter(x => x !== mode)) : setGameModes([...gameModes, mode]);
    };

    const toggleYouFaction = (faction: number) => {
        youFactions.includes(faction) ? setYouFactions(youFactions.filter(x => x !== faction)) : setYouFactions([...youFactions, faction]);
    };

    const toggleOppFaction = (faction: number) => {
        oppFactions.includes(faction) ? setOppFactions(oppFactions.filter(x => x !== faction)) : setOppFactions([...oppFactions, faction]);
    };

    const filterMatches = (matches: Match[]) => {
        let filtered: Match[] = [];
        if (query.length >= 3) {
            filtered = posts;
        } else {
            filtered = matches;
        }
        if (onlyWins) {
            filtered = filtered.filter(x => x.is_winner === true);
        }
        if (onlyLosses) {
            filtered = filtered.filter(x => x.is_winner === false);
        }
        if (youFactions.length > 0) {
            filtered = filtered.filter(x => youFactions.includes(x.faction_id));
        }
        if (oppFactions.length > 0) {
            filtered = filtered.filter(x => oppFactions.includes(x.opponent_faction_id));
        }
        if (gameModes.length > 0) {
            filtered = filtered.filter(x => gameModes.includes(x.game_type));
        }
        return filtered;
    };

    //#endregion

    const fetchallplayers = async () => {
        return await supabase.from("players").select();
    };

    const fetchplayer = async (username: string) => {
        return await supabase.from("players").select("username, user_id").eq("username", username);
        //const response = await connection.queryobject`select username, user_id from players where username = ${username}`;
    };

    const postPlayers = async () => {
        const allPlayersJson = await fetchallplayers();
        const allPlayers = allPlayersJson.data as Player[];

        const rows = matches.map(
            match =>
                ({
                    username: match.opponent_username,
                    user_id: match.opponent_id,
                } as Player)
        );

        const uniqueData = rows.reduce((uniqueList: Player[], item: Player) => {
            const isDuplicate = uniqueList.some(uniqueItem => uniqueItem.username === item.username);

            if (!isDuplicate) {
                uniqueList.push(item);
            }

            return uniqueList;
        }, []);

        const newData = uniqueData.filter(item => {
            return !allPlayers.some(allPlayer => allPlayer.username === item.username);
        });

        const { error } = await supabase.from("players").insert(newData);
        if (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (matches.length > 0) {
            postPlayers();
        }
    }, [matches]);

    useEffect(() => {
        const fetchAndSetPlayer = async () => {
            const playerDB = await fetchplayer(player);
            setCurrPlayer(playerDB.data[0]);
        };
        fetchAndSetPlayer();
    }, [player]);

    useEffect(() => {
        setFiltered(filterMatches(matches));
    }, [onlyWins, onlyLosses, youFactions, oppFactions, gameModes, query, loadingHistory === false]);

    useEffect(() => {
        const fetchItems = async () => {
            const url = matchHistoryStart + currPlayer?.user_id.trim() + matchHistoryEnd;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenNangert}`,
                    },
                });
                const data = await response.json();
                setMatches(data);
                setFiltered(data);
                setLoadingHistory(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoadingHistory(false);
            }
        };

        if (currPlayer !== null && currPlayer !== undefined) {
            fetchItems();
        }
    }, [tokenRanks, matchHistoryStart, matchHistoryEnd, currPlayer]);

    if (loadingHistory) {
        return <p>Loading data...</p>;
    }

    return (
        <div>
            <Button onClick={toggle} id="FilterButton">
                Show filters
            </Button>
            <Collapse in={filtersOpen}>
                <Grid>
                    <Grid.Col>
                        <h2>Opponent:</h2>
                        <TextInput label="Player name" onChange={handleSearch} value={query} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <h2>Your faction:</h2>
                        <Checkbox label="Lyonar" checked={youFactions.includes(1)} onChange={() => toggleYouFaction(1)} />
                        <Checkbox label="Songhai" checked={youFactions.includes(2)} onChange={() => toggleYouFaction(2)} />
                        <Checkbox label="Vetruvian" checked={youFactions.includes(3)} onChange={() => toggleYouFaction(3)} />
                        <Checkbox label="Abyssian" checked={youFactions.includes(4)} onChange={() => toggleYouFaction(4)} />
                        <Checkbox label="Magmar" checked={youFactions.includes(5)} onChange={() => toggleYouFaction(5)} />
                        <Checkbox label="Vanar" checked={youFactions.includes(6)} onChange={() => toggleYouFaction(6)} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <h2>Opponents faction:</h2>
                        <Checkbox label="Lyonar" checked={oppFactions.includes(1)} onChange={() => toggleOppFaction(1)} />
                        <Checkbox label="Songhai" checked={oppFactions.includes(2)} onChange={() => toggleOppFaction(2)} />
                        <Checkbox label="Vetruvian" checked={oppFactions.includes(3)} onChange={() => toggleOppFaction(3)} />
                        <Checkbox label="Abyssian" checked={oppFactions.includes(4)} onChange={() => toggleOppFaction(4)} />
                        <Checkbox label="Magmar" checked={oppFactions.includes(5)} onChange={() => toggleOppFaction(5)} />
                        <Checkbox label="Vanar" checked={oppFactions.includes(6)} onChange={() => toggleOppFaction(6)} />
                    </Grid.Col>
                    <Grid.Col>
                        <h2>Game mode:</h2>
                        <Checkbox label="Ranked" checked={gameModes.includes("ranked")} onChange={() => toggleGameMode("ranked")} />
                        <Checkbox label="Gauntlet" checked={gameModes.includes("gauntlet")} onChange={() => toggleGameMode("gauntlet")} />
                        <Checkbox label="Friendly" checked={gameModes.includes("friendly")} onChange={() => toggleGameMode("friendly")} />
                    </Grid.Col>
                    <Grid.Col>
                        <Checkbox label="Only your wins" onChange={() => setOnlyWins(!onlyWins)} />
                    </Grid.Col>
                    <Grid.Col>
                        <Checkbox label="Only opponents wins" onChange={() => setOnlyLosses(!onlyLosses)} />
                    </Grid.Col>
                </Grid>
            </Collapse>

            <br />

            <ul id="list">
                {filtered &&
                    filtered.map((match: Match) => (
                        <>
                            <MatchHistoryItem match={match} player={player} />
                        </>
                    ))}
            </ul>
        </div>
    );
};

export default MatchHistory;
