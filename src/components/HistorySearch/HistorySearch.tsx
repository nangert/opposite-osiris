import CustomButton from "@components/CustomComponents/CustomButton";
import CustomTextInput from "@components/CustomComponents/CustomTextInput";
import { Grid } from "@mantine/core";
import { useState } from "react";

const HistorySearch = () => {
    const [playerName, setPlayerName] = useState("");
    const user = Deno.env.get("DUELYST_USER");
    console.log(user);
    const token = Deno.env.get("DUELYST_API");
    console.log(token);

    const handleClick = () => {
        if (playerName.trim()) {
            location.href = `/history/${playerName.trim().toLocaleLowerCase()}`;
        }
    };

    const handlePlayerName = (event: any) => {
        setPlayerName(event.target.value);
    };

    return (
        <>
            <h1>Dev branch</h1>
            <h2>Player name:</h2>
            <Grid style={{ display: "flex", alignContent: "flex-end" }}>
                <Grid.Col span={10}>
                    <CustomTextInput onChange={handlePlayerName} value={playerName} />
                </Grid.Col>
                <Grid.Col span={2}>
                    <CustomButton onClick={handleClick}>Search</CustomButton>
                </Grid.Col>
            </Grid>
        </>
    );
};

export default HistorySearch;
