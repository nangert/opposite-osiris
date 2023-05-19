import type { Match } from "@components/Interfaces";
import "./MatchHistoryItem.css";
import * as dayjs from "dayjs";
import { Collapse } from "@mantine/core";
import { useState } from "react";

const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];

interface MatchDetailsProps {
    matchId: number;
    match: Match;
    player: string;
}

const MatchHistoryItem = ({ matchId, match, player }: MatchDetailsProps) => {
    const [matchDetails, setMatchDetails] = useState(false);

    const getTime = (timestamp: number) => {
        const date = dayjs.unix(timestamp / 1000);

        return date.format("DD/MM/YYYY HH:mm");
    };

    const collapseDetails = () => {
        setMatchDetails(!matchDetails);
    };

    return (
        <li>
            <div id="historyItem" onClick={collapseDetails}>
                <div id="matchId">{matchId + 1}</div>

                {match.is_player_1 && (
                    <>
                        <div id={match.is_winner ? "winner" : "neutral"}>{player}</div>
                        <div id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>{match.opponent_username}</div>
                    </>
                )}

                {!match.is_player_1 && (
                    <>
                        <div id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>{match.opponent_username}</div>
                        <div id={match.is_winner ? "winner" : "neutral"}>{player}</div>
                    </>
                )}
            </div>
            <Collapse in={matchDetails} id="matchDetails">
                <div>
                    <div id="factions">
                        <div id="faction1">{match.is_player_1 ? faction_ids[match.faction_id - 1] : faction_ids[match.opponent_faction_id - 1]}</div>
                        <div id="faction2">{match.is_player_1 ? faction_ids[match.opponent_faction_id - 1] : faction_ids[match.faction_id - 1]}</div>
                    </div>
                    <div id="DetailsHeader">
                        <div id="gameMode">Mode: {match.game_type}</div>
                        <div id="detailsWinner">Winner: {match.is_winner ? player : match.opponent_username}</div>
                    </div>
                    <div>
                        <div id="timestamp">Time: {getTime(match.created_at)}</div>
                    </div>

                    <div id="stats"></div>
                </div>
            </Collapse>
        </li>
    );
};

export default MatchHistoryItem;
