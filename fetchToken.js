const fetch = require("node-fetch");

async function getSessionToken() {
    const sessionLink = "https://api.duelyst2.com/session";
    const loginInfo = {
        username: process.env.DUELYST_LOGIN,
        password: process.env.DUELYST_PASSWORD
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
            console.log('New token:', newToken);
        } else {
            console.log('Failed to send POST request. Status code:', response.status);
        }
    } catch (error) {
        console.error('Error in POST request:', error.message);
    }
}

getSessionToken();
