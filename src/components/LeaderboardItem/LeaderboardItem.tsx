import "./LeaderboardItem.css";

interface LeaderboardItem {
    rank: number;
    oldRank: string;
    username: string;
    blatmmr: number;
    oldBlatmmr: string;
}

const calcRankDiff = (rank: number, oldRank: string) => {
    if (!isNaN(Number(oldRank))) {
        const change = Number(oldRank) - rank;
        return change == 0 ? "" : change > 0 ? "+" + change : change;
    }
    return "new";
};

const calcMmrDiff = (blatmmr: number, oldBlatmmr: string) => {
    if (!isNaN(Number(oldBlatmmr))) {
        const change = blatmmr - Number(oldBlatmmr);
        return change == 0 ? "" : change > 0 ? "+" + change : change;
    }
    return "";
};

const getRankLabelColor = (rank: number, oldRank: string) => {
    if (isNaN(Number(calcRankDiff(rank, oldRank))) || Number(calcRankDiff(rank, oldRank)) > 0) {
        return "RankDiffLabelGreen";
    } else if (Number(calcRankDiff(rank, oldRank)) < 0) {
        return "RankDiffLabelRed";
    }
    return "RankDiffLabel";
};

const getMMRLabelColor = (rank: number, oldRank: string) => {
    if (isNaN(Number(calcRankDiff(rank, oldRank))) || Number(calcRankDiff(rank, oldRank)) < 0) {
        return "RankDiffLabelGreen";
    } else if (Number(calcRankDiff(rank, oldRank)) > 0) {
        return "RankDiffLabelRed";
    }
    return "RankDiffLabel";
};

const LeaderboardItem: React.FC<LeaderboardItem> = ({ rank, oldRank, username, blatmmr, oldBlatmmr }) => {
    return (
        <div id="LeaderBoardItem">
            <div id="RankLabel">Rank: {rank}</div>
            <div id={getRankLabelColor(rank, oldRank)}>{calcRankDiff(rank, oldRank)}</div>
            <div id="UsernameLabel">{username}</div>
            <div id="MMRLabel">{blatmmr}</div>
            <div id={getMMRLabelColor(blatmmr, oldBlatmmr)}>{calcMmrDiff(blatmmr, oldBlatmmr)}</div>
        </div>
    );
};

export default LeaderboardItem;
