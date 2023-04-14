import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import "./MatchHistory.css";
import type { MatchHistoryItem } from "./Interfaces";

// Configs fuse.js
// https://fusejs.io/api/options.html
const fuseOptions = {
    keys: ["opponent_username"], // specify the property you want to filter by, e.g., 'name'
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
const matchHistoryStart = import.meta.env.PUBLIC_MATCH_HISTORY_START;
const matchHistoryEnd = import.meta.env.PUBLIC_MATCH_HISTORY_END;
const token = import.meta.env.PUBLIC_DUELYST_TOKEN;

const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];

// const pool = new postgres.Pool(databaseUrl, 3, true);

// const connection = await pool.connect();

// const fetchallplayers = async () => {
//     return await connection.queryObject`SELECT * FROM players`;
// };

// // const fetchplayer = async (username: string) => {
// //     return await connection.queryobject`select username, user_id from players where username = ${username}`;
// // };

const MatchHistory = (username: string) => {
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [matches, setMatches] = useState([] as MatchHistoryItem[]);

    useEffect(() => {
        const fetchItems = async (user_id: string) => {
            try {
                const response = await fetch(matchHistoryStart + user_id + matchHistoryEnd, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setMatches(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };
        const user_id = "-NJW19A1jvOyXiVn-Wy7";
        fetchItems(user_id);
    }, [token, matchHistoryStart, matchHistoryEnd]);

    if (loading) {
        return <p>{token}</p>;
    }

    const fuse = new Fuse(matches, fuseOptions);

    // Set a limit to the posts: 5
    const posts = fuse.search(query).map(result => result.item);

    function handleOnSearch({ target = "" }) {
        setQuery(target);
    }

    return (
        <div>
            <label>Filter players:</label>
            <input type="text" value={query} onChange={() => handleOnSearch} placeholder="Search posts" />
            <br />
            <ul id="list">
                {matches &&
                    matches.map((match: MatchHistoryItem) => (
                        <li>
                            {match.is_player_1 && (
                                <h4>
                                    <label id={match.is_winner ? "winner" : "neutral"}>
                                        {"username"} ({faction_ids[match.faction_id - 1]})
                                    </label>
                                    -{" "}
                                    <label id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>
                                        {match.opponent_username} ({faction_ids[match.opponent_faction_id - 1]})
                                    </label>
                                </h4>
                            )}

                            {!match.is_player_1 && (
                                <h4>
                                    <label id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>
                                        {match.opponent_username} ({faction_ids[match.opponent_faction_id - 1]})
                                    </label>
                                    -{" "}
                                    <label id={match.is_winner ? "winner" : "neutral"}>
                                        {"username"} ({faction_ids[match.faction_id - 1]})
                                    </label>
                                </h4>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default MatchHistory;
