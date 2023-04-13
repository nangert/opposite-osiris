import Fuse from "fuse.js";
import { useState } from "react";
import "../components/MatchHistory.css";

// Configs fuse.js
// https://fusejs.io/api/options.html
const fuseOptions = {
    keys: ["opponent_username"], // specify the property you want to filter by, e.g., 'name'
    includeScore: true,
    threshold: 0.3, // adjust the threshold based on your needs
};

var faction_ids = [
    "Lyonar",
    "Songhai",
    "Vetruvian",
    "Abyssian",
    "Magmar",
    "Vanar",
];

function Search({ searchList, player }) {
    // User's input

    console.log(searchList[0]);
    const [query, setQuery] = useState("");

    const fuse = new Fuse(searchList, fuseOptions);

    // Set a limit to the posts: 5
    const posts = fuse.search(query).map(result => result.item);

    function handleOnSearch({ target = "" }) {
        const { value } = target;
        setQuery(value);
    }

    return (
        <>
            <label>Filter players:</label>
            <input
                type="text"
                value={query}
                onChange={handleOnSearch}
                placeholder="Search posts"
            />
            {query.length > 1 && (
                <p>
                    Found {posts.length}{" "}
                    {posts.length === 1 ? "result" : "results"} for '{query}'
                </p>
            )}
            <ul>
                {posts &&
                    posts.map(match => (
                        <li>
                            {match.is_player_1 && (
                                <h4>
                                    <label
                                        id={
                                            match.is_winner
                                                ? "winner"
                                                : "neutral"
                                        }
                                    >
                                        {player} (
                                        {faction_ids[match.faction_id - 1]})
                                    </label>
                                    -{" "}
                                    <label
                                        id={
                                            !match.is_winner
                                                ? match.is_draw
                                                    ? "neutral"
                                                    : "loser"
                                                : "neutral"
                                        }
                                    >
                                        {match.opponent_username} (
                                        {
                                            faction_ids[
                                                match.opponent_faction_id - 1
                                            ]
                                        }
                                        )
                                    </label>
                                </h4>
                            )}

                            {!match.is_player_1 && (
                                <h4>
                                    <label
                                        id={
                                            !match.is_winner
                                                ? match.is_draw
                                                    ? "neutral"
                                                    : "loser"
                                                : "neutral"
                                        }
                                    >
                                        {match.opponent_username} (
                                        {
                                            faction_ids[
                                                match.opponent_faction_id - 1
                                            ]
                                        }
                                        )
                                    </label>
                                    -{" "}
                                    <label
                                        id={
                                            match.is_winner
                                                ? "winner"
                                                : "neutral"
                                        }
                                    >
                                        {player} (
                                        {faction_ids[match.faction_id - 1]})
                                    </label>
                                </h4>
                            )}
                        </li>
                    ))}
            </ul>
        </>
    );
}

export default Search;
