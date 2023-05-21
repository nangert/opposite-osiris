import MatchHistory from "./MatchHistory";
import { PlayerHistoryContext } from "./PlayerHistoryContext";

type MatchHistoryRootProps = {
    username: string;
};

const MatchHistoryRoot = (props: MatchHistoryRootProps) => {
    return (
        <>
            <PlayerHistoryContext.Provider value={{ username: props.username }}>
                <MatchHistory />
            </PlayerHistoryContext.Provider>
        </>
    );
};

export default MatchHistoryRoot;
