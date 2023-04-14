import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import "./MatchHistory.css";

// Configs fuse.js
// https://fusejs.io/api/options.html
const fuseOptions = {
    keys: ["opponent_username"], // specify the property you want to filter by, e.g., 'name'
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

interface PlayerData {
    username: string;
    rating: number;
    place: number;
}

interface Player {
    username: string;
    user_id: string;
}

interface MatchHistoryItem {
    user_id: string;
    game_id: string;
    game_type: string;
    game_server: string;
    gauntlet_ticket_id: number | null;
    is_scored: boolean;
    is_winner: boolean;
    is_draw: boolean;
    is_player_1: boolean;
    faction_id: number;
    general_id: number;
    faction_xp: number;
    faction_xp_earned: number;
    opponent_id: string;
    opponent_faction_id: number;
    opponent_general_id: number;
    opponent_username: string;
    game_version: string;
    rewards: string | null;
    reward_ids: string | null;
    rank_before: number;
    rank_stars_before: number;
    rank_delta: number;
    rank_stars_delta: number;
    rank_win_streak: number;
    is_daily_win: boolean;
    play_count_reward_progress: number;
    win_count_reward_progress: number;
    has_maxed_play_count_rewards: boolean;
    has_maxed_win_count_rewards: boolean;
    created_at: number;
    updated_at: number;
    ended_at: number;
    status: string;
    gold_tip_amount: number | null;
    rift_ticket_id: null;
    rift_points: null;
    rift_points_earned: null;
    rift_rating_after: null;
    rift_rating_earned: null;
    digest: string;
}

// const pool = new postgres.Pool(databaseUrl, 3, true);

// const connection = await pool.connect();

// const fetchallplayers = async () => {
//     return await connection.queryObject`SELECT * FROM players`;
// };

// // const fetchplayer = async (username: string) => {
// //     return await connection.queryobject`select username, user_id from players where username = ${username}`;
// // };

function MatchHistory(username: string) {
    const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];
    const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
    const matchHistoryStart = import.meta.env.PUBLIC_MATCH_HISTORY_START;
    const matchHistoryEnd = import.meta.env.PUBLIC_MATCH_HISTORY_END;
    const token = import.meta.env.SECRET_DUELYST_TOKEN;

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerHistory = async () => {
            const url = matchHistoryStart.trim() + "-NJW19A1jvOyXiVn-Wy7" + matchHistoryEnd.trim();
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
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items: ", error);
                setLoading(false);
            }
        };

        fetchPlayerHistory;
    });

    if (loading) {
        return <p>Loading items...</p>;
    }

    const [query, setQuery] = useState("");

    const fuse = new Fuse(matches, fuseOptions);

    // Set a limit to the posts: 5
    const posts = fuse.search(query).map(result => result.item);

    function handleOnSearch({ target = "" }) {
        setQuery(target);
    }

    return (
        <>
            <label>Filter players:</label>
            <input type="text" value={query} onChange={() => handleOnSearch} placeholder="Search posts" />

            <ul id="list">
                {posts &&
                    posts.map((match: MatchHistoryItem) => (
                        <li>
                            {match.is_player_1 && (
                                <h4>
                                    <label id={match.is_winner ? "winner" : "neutral"}>
                                        {username} ({faction_ids[match.faction_id - 1]})
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
                                        {username} ({faction_ids[match.faction_id - 1]})
                                    </label>
                                </h4>
                            )}
                        </li>
                    ))}
            </ul>
        </>
    );
}

export default MatchHistory;
