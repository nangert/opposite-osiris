import { useState } from "react";
import CustomTextInput from "@components/CustomComponents/CustomTextInput";
import { Button, Grid } from "@mantine/core";
import CustomButton from "@components/CustomComponents/CustomButton";

const HistorySearch = () => {
    const [playerName, setPlayerName] = useState("");

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
