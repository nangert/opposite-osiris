import type { Match } from "@components/Interfaces";
import { Chart, LinearScale, CategoryScale, LineController, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(LineController, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend);

import { Line } from "react-chartjs-2";

interface WinrateChartProps {
    history: Match[];
}

interface Winrates {
    timestamp: number;
    winrate: number;
}

const WinrateChart = ({ history }: WinrateChartProps) => {
    const [winrates, setWinrates] = useState<Winrates[]>([]);

    const calculateRollingWinrate = (matches: Match[], windowSize: number) => {
        let winrates = [];
        for (let i = windowSize; i <= matches.length; i++) {
            let windowMatches = matches.slice(i - windowSize, i);
            let wins = windowMatches.filter(match => match.is_winner).length;
            let winrate = wins / windowSize;
            winrates.push({
                timestamp: windowMatches[windowMatches.length - 1].created_at,
                winrate: winrate,
            });
        }

        return winrates;
    };

    const getRollingWinrateMode = (mode: string) => {
        const games = history.filter(x => x.game_type === mode);
        const reversedGames = [...games].reverse();
        const winrates = calculateRollingWinrate(reversedGames, 100);
        return winrates;
    };

    useEffect(() => {
        const rankedWr = getRollingWinrateMode("ranked");
        setWinrates(rankedWr);
    }, [history]);

    const data = {
        labels: winrates.map(winrate => new Date(winrate.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: "Winrate",
                data: winrates.map(winrate => winrate.winrate),
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 1,
            },
        },
    };

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default WinrateChart;
