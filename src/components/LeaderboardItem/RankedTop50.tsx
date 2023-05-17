import { useEffect, useState } from "react";
import LeaderboardItem from "./LeaderboardItem";

import "./RankedTop50.css";
import "./LeaderboardItem.css";

//ChangeImport
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
//import { createClient } from '@supabase/supabase-js'

import { Select, SelectItem } from "@mantine/core";

interface Top50RankedProps {
    players: PlayerData[];
}

interface PlayerData {
    username: string;
    rating: number;
    place: number;
}

interface HistoryPlayerData {
    id: number;
    created_at: Date;
    timestamp_id: number;
    username: string;
    user_id: string;
    placement: number;
    blatmmr: number;
}

interface HistoryTimestamp {
    id: number;
    created_at: string;
}

const dbUrl = "https://gblhpiwrdmnzhdjidnwi.supabase.co";
const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGhwaXdyZG1uemhkamlkbndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyNDY5NzIsImV4cCI6MTk5NjgyMjk3Mn0.xCWTsPeKXrVA-yw6KNcJL33Nf4MzbrS6gL0MGQmNG0M";
const supabase = createClient(dbUrl, anonKey);

const RankedTop50: React.FC<Top50RankedProps> = ({ players }) => {
    const [timestamps, setTimestamps] = useState([] as HistoryTimestamp[]);
    const [currTimestamp, setCurrTimestamp] = useState<string | null>("16");
    const [comparison, setComparison] = useState([] as HistoryPlayerData[]);

    const timestampsData = timestamps.map(timestamp => {
        return {
            value: timestamp.id.toString(),
            label: new Date(timestamp.created_at).toLocaleDateString() + " " + new Date(timestamp.created_at).toLocaleTimeString(),
        } as SelectItem;
    });

    const fetchHistoryTimestamps = async () => {
        const { data, error } = await supabase.from("RankedTop50Timestamps").select("id, created_at").order("id", { ascending: false }).limit(30);

        if (error) {
            console.log(error);
        }

        if (data && data.length > 0) {
            return data as HistoryTimestamp[];
        } else {
            return [] as HistoryTimestamp[];
        }
    };

    const fetchComparisonFromTimestamp = async (timestampID: number) => {
        console.log(timestampID);
        const { data, error } = await supabase.from("RankedTop50Players").select().order("placement", { ascending: true }).eq("timestamp_id", timestampID);

        if (error) {
            console.log(error);
        }

        if (data && data.length > 0) {
            return data as HistoryPlayerData[];
        } else {
            return [] as HistoryPlayerData[];
        }
    };

    const getOldPlayerRank = (username: string) => {
        const oldRank = comparison.find(x => x.username === username);
        if (oldRank) {
            return oldRank.placement.toString();
        } else {
            return "new";
        }
    };

    const getOldPlayerMMR = (username: string) => {
        const oldMMR = comparison.find(x => x.username === username);
        if (oldMMR) {
            return oldMMR.blatmmr.toString();
        } else {
            return "new";
        }
    };

    useEffect(() => {
        const fetchAndSetTimestamps = async () => {
            if (players && players.length > 0) {
                const timestamps: HistoryTimestamp[] = await fetchHistoryTimestamps();
                if (timestamps && timestamps.length > 0) {
                    setTimestamps(timestamps);
                }
            } else {
                setTimestamps([]);
            }
        };
        fetchAndSetTimestamps();
    }, [players]);

    useEffect(() => {
        const fetchAndSetComparison = async () => {
            const comparison: HistoryPlayerData[] = await fetchComparisonFromTimestamp(Number(currTimestamp));
            if (comparison) {
                console.log(comparison);
                setComparison(comparison);
            }
        };
        fetchAndSetComparison();
    }, [currTimestamp]);

    return (
        <>
            <div id="DatePicker">
                <Select value={currTimestamp} onChange={setCurrTimestamp} data={timestampsData} />
            </div>
            <div id="LeaderBoardItem">
                <ul id="links">
                    <li>
                        <div id="LeaderBoardItem">
                            <div id="RankLabel">Rank</div>
                            <div id="RankDiffLabel">Diff</div>
                            <div id="UsernameLabel">Player</div>
                            <div id="MMRLabel">BlatMMR</div>
                            <div id="MMRDiffLabel">Diff</div>
                        </div>
                    </li>
                    {players?.map((player: PlayerData) => {
                        const link = "/history/" + player.username;

                        //TODO: LinkButton
                        return (
                            <li>
                                <a href={link}>
                                    <LeaderboardItem
                                        rank={player.place}
                                        oldRank={getOldPlayerRank(player.username)}
                                        username={player.username}
                                        blatmmr={player.rating}
                                        oldBlatmmr={getOldPlayerMMR(player.username)}
                                    />
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default RankedTop50;
