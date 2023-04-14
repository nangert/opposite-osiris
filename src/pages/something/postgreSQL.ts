import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

const databaseUrl = import.meta.env.SECRET_DATABASEKEY;
const matchHistoryStart = import.meta.env.PUBLIC_MATCH_HISTORY_START;
const matchHistoryEnd = import.meta.env.PUBLIC_MATCH_HISTORY_END;
const token = import.meta.env.SECRET_DUELYST_TOKEN;

const pool = new postgres.Pool(databaseUrl, 3, true);

export const fetchallplayers = async () => {
    const connection = await pool.connect();
    return await connection.queryObject`SELECT * FROM players`;
};

export const fetchplayer = async (username: string) => {
    const connection = await pool.connect();
    return await connection.queryObject`SELECT username, user_id FROM players where username = ${username}`;
};
