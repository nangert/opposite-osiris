import GamesChart from "@components/CustomComponents/CustomGamesPlayedGraphic";
import WinrateChart from "@components/CustomComponents/CustomWinrateGraphic";
import { PlayerHistoryContext } from "@components/PlayerHistoryContext";
import { Collapse } from "@mantine/core";
import { useContext, useState } from "react";
import "./PlayerStats.css";

const PlayerStats = () => {
    const { username, history, setHistory, loading } = useContext(PlayerHistoryContext);

    const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];

    const [factionOpen, setFactionOpen] = useState<Number[]>([]);
    const [factionAgainstOpen, setFactionAgainstOpen] = useState<Number[]>([]);

    const toggleFaction = (faction: number) => {
        factionOpen.includes(faction) ? setFactionOpen(factionOpen.filter(x => x !== faction)) : setFactionOpen([...factionOpen, faction]);
    };

    const toggleFactionAgainst = (faction: number) => {
        factionAgainstOpen.includes(faction)
            ? setFactionAgainstOpen(factionAgainstOpen.filter(x => x !== faction))
            : setFactionAgainstOpen([...factionAgainstOpen, faction]);
    };

    const getFactionWr = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);

        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);

        return !isNaN(faction_wins.length / faction_games.length) ? (faction_wins.length / faction_games.length).toFixed(2) : "No games";
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

        return !isNaN(faction_wins.length / faction_games.length) ? (faction_wins.length / faction_games.length).toFixed(2) : "No games";
    };

    const getWrFirst = (mode: string, first: boolean) => {
        const faction_games = history.filter(x => x.is_player_1 === first && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);

        return !isNaN(faction_wins.length / faction_games.length) ? (faction_wins.length / faction_games.length).toFixed(2) : "No games";
    };

    const getWrTotal = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);
        const wins = games.filter(x => x.is_winner);

        return !isNaN(wins.length / games.length) ? (wins.length / games.length).toFixed(2) : "No games";
    };

    const getGamesTotal = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);

        return games.length;
    };

    const getAgainstFaction = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);
        const games = history.filter(x => x.opponent_faction_id === faction_id + 1 && x.game_type === mode);
        const wins = games.filter(x => x.is_winner);

        return !isNaN(wins.length / games.length) ? (wins.length / games.length).toFixed(2) : "No games";
    };

    const getAgainstFactionFirst = (faction: string, mode: string, first: boolean) => {
        const faction_id = faction_ids.indexOf(faction);
        const games = history.filter(x => x.opponent_faction_id === faction_id + 1 && x.game_type === mode && x.is_player_1 === first);
        const wins = games.filter(x => x.is_winner);

        return !isNaN(wins.length / games.length) ? (wins.length / games.length).toFixed(2) : "No games";
    };

    const getAgainstFactionGames = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);
        const games = history.filter(x => x.opponent_faction_id === faction_id + 1 && x.game_type === mode);

        return games.length;
    };

    const getBlatmFactorFaction = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);
        const faction_games = history.filter(x => x.faction_id === faction_id + 1 && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);
        const faction_draws = faction_games.filter(x => x.is_draw);
        const faction_losses = faction_games.filter(x => x.is_winner === false && x.is_draw === false);

        if (faction_wins.length > faction_losses.length) {
            return !isNaN(Math.sqrt(faction_wins.length + faction_draws.length / 2) / faction_games.length)
                ? "+/- " + (Math.sqrt(faction_wins.length + faction_draws.length / 2) / faction_games.length).toFixed(2)
                : "";
        } else {
            return !isNaN(Math.sqrt(faction_losses.length + faction_draws.length / 2) / faction_games.length)
                ? "+/- " + (Math.sqrt(faction_losses.length + faction_draws.length / 2) / faction_games.length).toFixed(2)
                : "";
        }
    };

    const getBlatmFactorFactionAgainst = (faction: string, mode: string) => {
        const faction_id = faction_ids.indexOf(faction);
        const faction_games = history.filter(x => x.opponent_faction_id === faction_id + 1 && x.game_type === mode);
        const faction_wins = faction_games.filter(x => x.is_winner);
        const faction_draws = faction_games.filter(x => x.is_draw);
        const faction_losses = faction_games.filter(x => x.is_winner === false && x.is_draw === false);

        if (faction_wins.length > faction_losses.length) {
            return !isNaN(Math.sqrt(faction_wins.length + faction_draws.length / 2) / faction_games.length)
                ? "+/- " + (Math.sqrt(faction_wins.length + faction_draws.length / 2) / faction_games.length).toFixed(2)
                : "";
        } else {
            return !isNaN(Math.sqrt(faction_losses.length + faction_draws.length / 2) / faction_games.length)
                ? "+/- " + (Math.sqrt(faction_losses.length + faction_draws.length / 2) / faction_games.length).toFixed(2)
                : "";
        }
    };

    const getBlatmFactorTotal = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);
        const wins = games.filter(x => x.is_winner);
        const draws = games.filter(x => x.is_draw);
        const losses = games.filter(x => x.is_winner === false && x.is_draw === false);

        if (wins.length > losses.length) {
            return !isNaN(Math.sqrt(wins.length + draws.length / 2) / games.length)
                ? "+/- " + (Math.sqrt(wins.length + draws.length / 2) / games.length).toFixed(2)
                : "";
        } else {
            return !isNaN(Math.sqrt(losses.length + draws.length / 2) / games.length)
                ? "+/- " + (Math.sqrt(losses.length + draws.length / 2) / games.length).toFixed(2)
                : "";
        }
    };

    return (
        <div className="statsTable">
            <div className="statsRow">
                <div className="stat">
                    <div className="wrfirst">Winrate ranked</div>
                    <div className="wrfirst">
                        {getWrTotal("ranked")} {getBlatmFactorTotal("ranked")}
                    </div>
                </div>
                <div className="stat">
                    <div className="wr">Ranked games</div>
                    <div className="wr">{getGamesTotal("ranked")}</div>
                </div>
                <div className="stat">
                    <div className="wr">Winrate P1</div>
                    <div className="wr">{getWrFirst("ranked", true)}</div>
                </div>
                <div className="stat">
                    <div className="wr">Winrate P2</div>
                    <div className="wr">{getWrFirst("ranked", false)}</div>
                </div>
            </div>

            <div className="statsRow">
                <div className="stat">
                    <div className="wrfirst">Winrate gauntlet</div>
                    <div className="wrfirst">
                        {getWrTotal("gauntlet")} {getBlatmFactorTotal("gauntlet")}
                    </div>
                </div>
                <div className="stat">
                    <div className="wr">Gauntlet games</div>
                    <div className="wr">{getGamesTotal("gauntlet")}</div>
                </div>
                <div className="stat">
                    <div className="wr">Winrate P1</div>
                    <div className="wr">{getWrFirst("gauntlet", true)}</div>
                </div>
                <div className="stat">
                    <div className="wr">Winrate P2</div>
                    <div className="wr">{getWrFirst("gauntlet", false)}</div>
                </div>
            </div>

            {history.length > 0 && (
                <div className="wrChart">
                    <WinrateChart history={history}></WinrateChart>
                </div>
            )}

            {history.length > 0 && (
                <div className="wrChart">
                    <GamesChart matches={[...history].reverse()}></GamesChart>
                </div>
            )}

            <div className="factionsHeader">Factions</div>

            {faction_ids.map((faction: string, key: number) => {
                return (
                    <div key={key}>
                        <div className="statsRow" onClick={() => toggleFaction(key)}>
                            <div className="stat">
                                <div className="hover:text-skin-accent">{faction}</div>
                            </div>
                        </div>

                        <Collapse in={factionOpen.includes(key)}>
                            <div className="statsRow">
                                <div className="stat">
                                    <div className="wrfirst">Winrate ranked</div>
                                    <div className="wrfirst">
                                        {getFactionWr(faction, "ranked")} {getBlatmFactorFaction(faction, "ranked")}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Games ranked</div>
                                    <div className="wrfirst">{getFactionGames(faction, "ranked")}</div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Winrate P1</div>
                                    <div className="wrfirst">{getFactionWrFirst(faction, "ranked", true)}</div>
                                </div>
                                <div className="stat">
                                    <div className="wr">Winrate P2</div>
                                    <div className="wr">{getFactionWrFirst(faction, "ranked", false)}</div>
                                </div>
                            </div>

                            <div className="statsRow">
                                <div className="stat">
                                    <div className="wr">Winrate gauntlet</div>
                                    <div className="wr">
                                        {getFactionWr(faction, "gauntlet")} {getBlatmFactorFaction(faction, "gauntlet")}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="wr">Games gauntlet</div>
                                    <div className="wr">{getFactionGames(faction, "gauntlet")}</div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Winrate P1</div>
                                    <div className="wrfirst">{getFactionWrFirst(faction, "gauntlet", true)}</div>
                                </div>
                                <div className="stat">
                                    <div className="wr">Winrate P2</div>
                                    <div className="wr">{getFactionWrFirst(faction, "gauntlet", false)}</div>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                );
            })}

            <div className="factionsHeader">Factions against</div>

            {faction_ids.map((faction: string, key: number) => {
                return (
                    <div key={key}>
                        <div className="statsRow" onClick={() => toggleFactionAgainst(key)}>
                            <div className="stat">
                                <div className="hover:text-skin-accent">{faction}</div>
                            </div>
                        </div>

                        <Collapse in={factionAgainstOpen.includes(key)}>
                            <div className="statsRow">
                                <div className="stat">
                                    <div className="wrfirst">Winrate ranked</div>
                                    <div className="wrfirst">
                                        {getAgainstFaction(faction, "ranked")} {getBlatmFactorFactionAgainst(faction, "ranked")}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Games ranked</div>
                                    <div className="wrfirst">{getAgainstFactionGames(faction, "ranked")}</div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Winrate P1</div>
                                    <div className="wrfirst">{getAgainstFactionFirst(faction, "ranked", true)}</div>
                                </div>
                                <div className="stat">
                                    <div className="wr">Winrate P2</div>
                                    <div className="wr">{getAgainstFactionFirst(faction, "ranked", false)}</div>
                                </div>
                            </div>

                            <div className="statsRow">
                                <div className="stat">
                                    <div className="wrfirst">Winrate gauntlet</div>
                                    <div className="wrfirst">
                                        {getAgainstFaction(faction, "gauntlet")} {getBlatmFactorFactionAgainst(faction, "gauntlet")}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Games gauntlet</div>
                                    <div className="wrfirst">{getAgainstFactionGames(faction, "gauntlet")}</div>
                                </div>
                                <div className="stat">
                                    <div className="wrfirst">Winrate P1</div>
                                    <div className="wrfirst">{getAgainstFactionFirst(faction, "gauntlet", true)}</div>
                                </div>
                                <div className="stat">
                                    <div className="wr">Winrate P2</div>
                                    <div className="wr">{getAgainstFactionFirst(faction, "gauntlet", false)}</div>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                );
            })}
        </div>
    );
};

export default PlayerStats;
