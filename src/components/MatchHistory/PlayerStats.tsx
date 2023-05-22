import { PlayerHistoryContext } from "@components/PlayerHistoryContext";
import { Collapse, Grid } from "@mantine/core";
import { useContext, useState } from "react";
import "./PlayerStats.css";

const PlayerStats = () => {
    const { username, history, setHistory, loading } = useContext(PlayerHistoryContext);

    const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];

    const [factionOpen, setFactionOpen] = useState<Number[]>([]);

    const toggleFaction = (faction: number) => {
        factionOpen.includes(faction) ? setFactionOpen(factionOpen.filter(x => x !== faction)) : setFactionOpen([...factionOpen, faction]);
    };

    const getFactionWr = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);

        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);

        return (faction_wins.length / faction_games.length).toFixed(2);
    };

    const getFactionGames = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);

        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.game_type === mode);

        return faction_games.length;
    };

    const getFactionWrFirst = (faction: string, mode: string, first: boolean) => {
        const faction_id = faction_ids.indexOf(faction);

        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.is_player_1 === first && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);

        return (faction_wins.length / faction_games.length).toFixed(2);
    };

    const getBlatmFactorFaction = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);
        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);
        const faction_losses = faction_games.filter(x => x.is_winner === false && x.is_draw === false);

        if (faction_wins.length > faction_losses.length) {
            return (Math.sqrt(faction_wins.length) / faction_games.length).toFixed(2);
        } else {
            return (Math.sqrt(faction_losses.length) / faction_games.length).toFixed(2);
        }
    };

    const getWrTotal = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);
        const wins = games.filter(x => x.is_winner);

        return (wins.length / games.length).toFixed(2);
    };

    const getGamesTotal = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);

        return games.length;
    };

    const getBlatmFactorTotal = (mode: string) => {
        const faction_games = history.filter(x => x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);
        const faction_losses = faction_games.filter(x => x.is_winner === false && x.is_draw === false);

        if (faction_wins.length > faction_losses.length) {
            return (Math.sqrt(faction_wins.length) / faction_games.length).toFixed(2);
        } else {
            return (Math.sqrt(faction_losses.length) / faction_games.length).toFixed(2);
        }
    };

    //     or, when I do stats for this, I print out "+- sqrt(max(num_wins, num_losses))/num_games"
    // the amount not the formula
    return (
        <div id="StatsPage">
            <ul>
                <li id="stats">
                    <div id="stats">
                        <div id="wrfirst">Winrate ranked</div>
                        <div id="wr">Ranked games</div>
                        <div id="wr">Winrate gauntlet</div>
                        <div id="wr">Gauntlet games</div>
                    </div>
                </li>

                <li id="statsHeader">
                    <div id="stats">
                        <div id="wrfirst">{getWrTotal("ranked")}</div>
                        <div id="wr">{getGamesTotal("ranked")}</div>
                        <div id="wr">{getWrTotal("gauntlet")}</div>
                        <div id="wr">{getGamesTotal("gauntlet")}</div>
                    </div>
                </li>

                <li id="stats">
                    <div id="stats">
                        <div id="wrfirst">Blatm Factor R</div>
                        <div id="wr">Blatm Factor G</div>
                    </div>
                </li>

                <li id="statsHeader">
                    <div id="stats">
                        <div id="wrfirst">{getBlatmFactorTotal("ranked")}</div>
                        <div id="wr">{getBlatmFactorTotal("gauntlet")}</div>
                    </div>
                </li>

                <li>
                    <div id="stats">
                        <div id="faction">Faction</div>
                        <div id="wr">WR Ranked</div>
                        <div id="wr">Ranked games</div>
                        <div id="wr">WR gauntlet</div>
                        <div id="wr">Gauntlet games</div>
                    </div>

                    {faction_ids.map((faction: string, key: number) => (
                        <div key={key} id="factionStats">
                            <div id="stats" onClick={() => toggleFaction(key)}>
                                <div id="faction">{faction}</div>
                                <div id="wr">{getFactionWr(faction, "ranked")}</div>
                                <div id="wr">{getFactionGames(faction, "ranked")}</div>
                                <div id="wr">{getFactionWr(faction, "gauntlet")}</div>
                                <div id="wr">{getFactionGames(faction, "gauntlet")}</div>
                            </div>
                            <Collapse in={factionOpen.includes(key)}>
                                <div id="factionCollapse">
                                    <div id="wrfirst">Blatm Factor R</div>
                                    <div id="wr">Blatm Factor G</div>
                                    <div id="wr">Going First</div>
                                    <div id="wr">Going Second</div>
                                </div>
                                <div id="factionCollapse">
                                    <div id="wrfirst">{getBlatmFactorFaction(faction, "ranked")}</div>
                                    <div id="wr">{getBlatmFactorFaction(faction, "gauntlet")}</div>
                                    <div id="wr">{getFactionWrFirst(faction, "ranked", false)}</div>
                                    <div id="wr">{getFactionWrFirst(faction, "gauntlet", false)}</div>
                                </div>
                            </Collapse>
                        </div>
                    ))}
                </li>
            </ul>
        </div>
    );
};

export default PlayerStats;
