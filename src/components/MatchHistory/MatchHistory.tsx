import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import "./MatchHistory.css";
import type { Match } from "../Interfaces";
import MatchHistoryItem from "./MatchHistoryItem";
import { TextInput } from "@mantine/core";

interface MatchHistoryProps {
    player: string;
}

const fuseOptions = {
    keys: ["opponent_username"],
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
const matchHistoryStart = import.meta.env.PUBLIC_MATCH_HISTORY_START;
const matchHistoryEnd = import.meta.env.PUBLIC_MATCH_HISTORY_END;
const token = import.meta.env.PUBLIC_DUELYST_TOKEN;

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
        return <p>Loading data...</p>;
    }

    const fuse = new Fuse(matches, fuseOptions);

    const posts = fuse.search(query).map(result => result.item);

    const handleSearch = (event: any) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log("Submitted value:", query);
    };

    return (
        <div>
            <label>Filter players:</label>
            <TextInput label="Player name" description="Player name" onChange={handleSearch} value={query} />
            <br />

            <ul id="list">
                {posts &&
                    query.length >= 3 &&
                    posts.map((match: Match) => (
                        <>
                            <h4>{match.opponent_username}</h4>
                            <MatchHistoryItem match={match} player={player} />
                        </>
                    ))}
                {!(posts && query.length >= 3) &&
                    matches.map((match: Match) => (
                        <>
                            <h4>{match.opponent_username}</h4>
                            <MatchHistoryItem match={match} player={player} />
                        </>
                    ))}
            </ul>
        </div>
    );
};

export default MatchHistory;
