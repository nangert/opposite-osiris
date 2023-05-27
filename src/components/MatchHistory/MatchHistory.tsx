import CustomButton from "@components/CustomComponents/CustomButton";
import CustomCheckbox from "@components/CustomComponents/CustomCheckbox";
import CustomTextInput from "@components/CustomComponents/CustomTextInput";
import { Collapse, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Fuse from "fuse.js";
import { useContext, useEffect, useState } from "react";
import type { Match, Player } from "../Interfaces";
import { PlayerHistoryContext } from "../PlayerHistoryContext";
import "./MatchHistory.css";
import MatchHistoryItem from "./MatchHistoryItem";

//ChangeImport
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
//import { createClient } from "@supabase/supabase-js";

const fuseOptions = {
    keys: ["opponent_username"],
    includeScore: true,
    threshold: 0, // adjust the threshold based on your needs
};

const MatchHistory = () => {
    const { username, history, setHistory, loading } = useContext(PlayerHistoryContext);

    //#region  useState
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [query, setQuery] = useState("");
    const [currPlayer, setCurrPlayer] = useState<Player | undefined>(undefined);

    const [filtersOpen, { toggle }] = useDisclosure(false);
    const [playerStats, setPlayerStats] = useState(false);

    const [onlyWins, setOnlyWins] = useState(false);
    const [onlyLosses, setOnlyLosses] = useState(false);

    const [youFactions, setYouFactions] = useState([] as number[]);
    const [oppFactions, setOppFactions] = useState([] as number[]);

    const [gameModes, setGameModes] = useState(["ranked", "gauntlet"] as string[]);

    const [filtered, setFiltered] = useState([] as Match[]);

    const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
    const anonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
    const supabase = createClient(dbUrl, anonKey);

    //#endregion

    //#region Filter

    const fuse = new Fuse(history, fuseOptions);

    const posts = fuse.search(query).map(result => result.item);

    const handleSearch = (event: any) => {
        setQuery(event.target.value);
    };

    const toggleGameMode = (mode: string) => {
        gameModes.includes(mode) ? setGameModes(gameModes.filter(x => x !== mode)) : setGameModes([...gameModes, mode]);
    };

    const toggleYouFaction = (faction: number) => {
        youFactions.includes(faction) ? setYouFactions(youFactions.filter(x => x !== faction)) : setYouFactions([...youFactions, faction]);
    };

    const toggleOppFaction = (faction: number) => {
        oppFactions.includes(faction) ? setOppFactions(oppFactions.filter(x => x !== faction)) : setOppFactions([...oppFactions, faction]);
    };

    const filterMatches = (matches: Match[]) => {
        let filtered: Match[] = [];
        if (query.length >= 3) {
            filtered = posts;
        } else {
            filtered = matches;
        }
        if (onlyWins) {
            filtered = filtered.filter(x => x.is_winner === true);
        }
        if (onlyLosses) {
            filtered = filtered.filter(x => x.is_winner === false);
        }
        if (youFactions.length > 0) {
            filtered = filtered.filter(x => youFactions.includes(x.faction_id));
        }
        if (oppFactions.length > 0) {
            filtered = filtered.filter(x => oppFactions.includes(x.opponent_faction_id));
        }
        if (gameModes.length > 0) {
            filtered = filtered.filter(x => gameModes.includes(x.game_type));
        }
        return filtered;
    };

    useEffect(() => {
        setFiltered(filterMatches(history));
    }, [onlyWins, onlyLosses, youFactions, oppFactions, gameModes, query, loadingHistory === false]);

    //#endregion

    const fetchplayer = async (username: string) => {
        return await supabase.from("players").select("username, user_id").eq("username", username);
    };

    useEffect(() => {
        const fetchAndSetPlayer = async () => {
            const playerDB = await fetchplayer(username);
            if (playerDB.data) {
                setCurrPlayer(playerDB.data[0]);
            }
        };
        fetchAndSetPlayer();
    }, [username]);

    return (
        <div>
            <div id="header">
                <CustomButton onClick={toggle} id="FilterButton">
                    Show filters
                </CustomButton>
            </div>

            <Collapse in={filtersOpen}>
                <Grid>
                    <Grid.Col>
                        <h2>Opponent:</h2>
                        <CustomTextInput label="Player name" onChange={handleSearch} value={query} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <h2>Your faction:</h2>
                        <CustomCheckbox label="Lyonar" checked={youFactions.includes(1)} onChange={() => toggleYouFaction(1)} />
                        <CustomCheckbox label="Songhai" checked={youFactions.includes(2)} onChange={() => toggleYouFaction(2)} />
                        <CustomCheckbox label="Vetruvian" checked={youFactions.includes(3)} onChange={() => toggleYouFaction(3)} />
                        <CustomCheckbox label="Abyssian" checked={youFactions.includes(4)} onChange={() => toggleYouFaction(4)} />
                        <CustomCheckbox label="Magmar" checked={youFactions.includes(5)} onChange={() => toggleYouFaction(5)} />
                        <CustomCheckbox label="Vanar" checked={youFactions.includes(6)} onChange={() => toggleYouFaction(6)} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <h2>Opponents faction:</h2>
                        <CustomCheckbox label="Lyonar" checked={oppFactions.includes(1)} onChange={() => toggleOppFaction(1)} />
                        <CustomCheckbox label="Songhai" checked={oppFactions.includes(2)} onChange={() => toggleOppFaction(2)} />
                        <CustomCheckbox label="Vetruvian" checked={oppFactions.includes(3)} onChange={() => toggleOppFaction(3)} />
                        <CustomCheckbox label="Abyssian" checked={oppFactions.includes(4)} onChange={() => toggleOppFaction(4)} />
                        <CustomCheckbox label="Magmar" checked={oppFactions.includes(5)} onChange={() => toggleOppFaction(5)} />
                        <CustomCheckbox label="Vanar" checked={oppFactions.includes(6)} onChange={() => toggleOppFaction(6)} />
                    </Grid.Col>
                    <Grid.Col>
                        <h2>Game mode:</h2>
                        <CustomCheckbox label="Ranked" checked={gameModes.includes("ranked")} onChange={() => toggleGameMode("ranked")} />
                        <CustomCheckbox label="Gauntlet" checked={gameModes.includes("gauntlet")} onChange={() => toggleGameMode("gauntlet")} />
                        <CustomCheckbox label="Friendly" checked={gameModes.includes("friendly")} onChange={() => toggleGameMode("friendly")} />
                    </Grid.Col>
                    <Grid.Col>
                        <CustomCheckbox label="Only your wins" onChange={() => setOnlyWins(!onlyWins)} />
                    </Grid.Col>
                    <Grid.Col>
                        <CustomCheckbox label="Only opponents wins" onChange={() => setOnlyLosses(!onlyLosses)} />
                    </Grid.Col>
                </Grid>
            </Collapse>

            <br />

            <ul id="list">
                {filtered && filtered.map((match: Match, key: number) => <MatchHistoryItem key={key} matchId={key} match={match} player={username} />)}
            </ul>
        </div>
    );
};

export default MatchHistory;
