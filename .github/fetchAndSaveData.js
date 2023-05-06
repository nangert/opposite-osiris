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

        const { timestamp, error } = await supabase.from("RankedTop50Timestamps").insert([{}]);
    } catch (error) {
        console.error("Error fetching and saving data:", error);
    }
})();
