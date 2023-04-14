import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
const matchHistoryStart = import.meta.env.PUBLIC_MATCH_HISTORY_START;
const matchHistoryEnd = import.meta.env.PUBLIC_MATCH_HISTORY_END;
const token = import.meta.env.SECRET_DUELYST_TOKEN;

const pool = new postgres.Pool(databaseUrl, 3, true);

const connection = await pool.connect();

export const fetchallplayers = async () => {
    return await connection.queryObject`SELECT * FROM players`;
};

export const fetchplayer = async (username: string) => {
    return await connection.queryObject`SELECT username, user_id FROM players where username = ${username}`;
};

export const fetchPlayerHistory = async (user_id: string) => {
    const url = matchHistoryStart.trim() + user_id.trim() + matchHistoryEnd.trim();
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
};
