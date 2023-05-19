import LeaderboardItem from "./LeaderboardItem";

import "./LeaderboardItem.css";
import "./RankedTop50.css";

import CustomLinkButton from "@components/CustomComponents/LinkButton";

interface Top50RankedProps {
    players: PlayerData[];
}

interface PlayerData {
    username: string;
    rating: number;
    place: number;
}

const GauntletTop50 = ({ players }: Top50RankedProps) => {
    return (
        <>
            <div id="LeaderBoardItem">
                <ul id="links">
                    {players?.map((player: PlayerData) => {
                        const link = "/history/" + player.username;

                        return (
                            <li>
                                <CustomLinkButton href={link}>
                                    <LeaderboardItem rank={player.place} oldRank={""} username={player.username} blatmmr={player.rating} oldBlatmmr={""} />
                                </CustomLinkButton>
                                <a href={link}></a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default GauntletTop50;
