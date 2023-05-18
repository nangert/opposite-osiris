import type { Match } from "@components/Interfaces";
import "./MatchHistoryItem.css";

const faction_ids = ["Lyonar", "Songhai", "Vetruvian", "Abyssian", "Magmar", "Vanar"];

interface MatchDetailsProps {
    match: Match;
    player: string;
}

const MatchHistoryItem: React.FC<MatchDetailsProps> = ({ match, player }) => {
    return (
        <li>
            {match.is_player_1 && (
                <h4>
                    <label id={match.is_winner ? "winner" : "neutral"}>
                        {" "}
                        {player} ({faction_ids[match.faction_id - 1]}){" "}
                    </label>{" "}
                    -{" "}
                    <label id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>
                        {" "}
                        {match.opponent_username} ({faction_ids[match.opponent_faction_id - 1]}){" "}
                    </label>
                </h4>
            )}

            {!match.is_player_1 && (
                <h4>
                    <label id={!match.is_winner ? (match.is_draw ? "neutral" : "loser") : "neutral"}>
                        {" "}
                        {match.opponent_username} ({faction_ids[match.opponent_faction_id - 1]}){" "}
                    </label>{" "}
                    -{" "}
                    <label id={match.is_winner ? "winner" : "neutral"}>
                        {" "}
                        {player} ({faction_ids[match.faction_id - 1]}){" "}
                    </label>
                </h4>
            )}
        </li>
    );
};

export default MatchHistoryItem;
