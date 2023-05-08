const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");

const dbUrl = process.env.DB_URL;
const anonKey = process.env.ANON_KEY;

const supabase = createClient(dbUrl, anonKey);

(async () => {
    try {
        const response = await fetch("https://api.duelyst2.com/blatmmr/v1/mmr/ranked-top50", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        const { data: insertedData, error } = await supabase.from("RankedTop50Timestamps").insert([{}]).select();

        if (insertedData && insertedData.length > 0) {
            const timestampId = insertedData[0].id;
            const playersData = data.players.map((player, index) => {
                return {
                    timestamp_id: timestampId,
                    username: player.username,
                    user_id: player.username,
                    placement: index + 1,
                    blatmmr: player.rating,
                };
            });

            console.log(playersData);

            const { data: insertedPlayers, error } = await supabase.from("RankedTop50Players").insert(playersData);
        }
    } catch (error) {
        console.error("Error fetching and saving data:", error);
    }
})();
