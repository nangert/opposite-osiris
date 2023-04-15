import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import "./MatchHistory.css";
import type { Match } from "../Interfaces";
import MatchHistoryItem from "./MatchHistoryItem";
import { TextInput, Checkbox, Grid } from "@mantine/core";

interface MatchHistoryProps {
    player: string;
}

const fuseOptions = {
    keys: ["opponent_username"],
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
// const matchHistoryStart = import.meta.env.SECRET_MATCH_HISTORY_START;
// const matchHistoryEnd = import.meta.env.SECRET_MATCH_HISTORY_END;
// const token = import.meta.env.SECRET_DUELYST_TOKEN;

const matchHistoryStart = "https://api.duelyst2.com/api/users/";
const matchHistoryEnd = "/games?len=3000&blatmmr=true";
const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkIjp7ImlkIjoiLU5KVzE5QTFqdk95WGlWbi1XeTciLCJlbWFpbCI6ImFuZ2VydC5uaWtsYXNAZ21haWwuY29tIiwidXNlcm5hbWUiOiJuYW5nZXJ0In0sInYiOjAsImlhdCI6MTY4MTQwMTczMywiZXhwIjoxNjgyNjExMzMzfQ.B_Cg-nxZUN26qeLJmpASF69DUI7G28B3W_kR0U1-Iec";
// const pool = new postgres.Pool(databaseUrl, 3, true);

// const connection = await pool.connect();

// const fetchallplayers = async () => {
//     return await connection.queryObject`SELECT * FROM players`;
// };

// // const fetchplayer = async (username: string) => {
// //     return await connection.queryobject`select username, user_id from players where username = ${username}`;
// // };

const MatchHistory: React.FC<MatchHistoryProps> = ({ player }) => {
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [matches, setMatches] = useState([] as Match[]);

    const [onlyWins, setOnlyWins] = useState(false);
    const [onlyLosses, setOnlyLosses] = useState(false);

    const [youFactions, setYouFactions] = useState([] as number[]);
    const [oppFactions, setOppFactions] = useState([] as number[]);

    const [filtered, setFiltered] = useState([] as Match[]);

    const fuse = new Fuse(matches, fuseOptions);

    const posts = fuse.search(query).map(result => result.item);

    const handleSearch = (event: any) => {
        setQuery(event.target.value);
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
        return filtered;
    };

    useEffect(() => {
        let base = matches;
        setFiltered(filterMatches(base));
    }, [onlyWins, onlyLosses, youFactions, oppFactions, query]);

    useEffect(() => {
        const fetchItems = async (user_id: string) => {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setMatches(data);
                setFiltered(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };

        const user_id = "-NJW19A1jvOyXiVn-Wy7";
        const url = matchHistoryStart + user_id + matchHistoryEnd;
        fetchItems(user_id);
    }, [token, matchHistoryStart, matchHistoryEnd]);

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <div>
            <h3>Filter players:</h3>
            <Grid>
                <Grid.Col>
                    <TextInput label="Player name" description="Player name" onChange={handleSearch} value={query} />
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
                    <Checkbox label="Only your wins" onChange={() => setOnlyWins(!onlyWins)} />
                </Grid.Col>
                <Grid.Col>
                    <Checkbox label="Only opponents wins" onChange={() => setOnlyLosses(!onlyLosses)} />
                </Grid.Col>
            </Grid>

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
