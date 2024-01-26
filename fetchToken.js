const fetch = require("node-fetch");

async function getSessionToken() {
    const sessionLink = "https://api.duelyst2.com/session";
    const loginInfo = {
        username: Deno.env.get("DUELYST_USER"),
        password: Deno.env.get("DUELYST_PW"),
    };

    try {
        const response = await fetch(sessionLink, {
            method: "POST",
            body: loginInfo,
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
            console.log('Success!');
            const newToken = response.data.token;
            Deno.env.set("DUELYST_API", newToken)
        } else {
            console.log('Failed to send POST request. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error in POST request:', error.message);
    }
}

getSessionToken();
