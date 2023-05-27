import { Chart, LinearScale, CategoryScale, LineController, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(LineController, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend);

import { Line } from "react-chartjs-2";

interface WinrateChartProps {
    dataWr: Winrates[];
}

interface Winrates {
    timestamp: number;
    winrate: number;
}

const WinrateChart = ({ dataWr }: WinrateChartProps) => {
    const data = {
        labels: dataWr.map(winrate => new Date(winrate.timestamp).toLocaleDateString()),
        datasets: [
            {
                label: "Winrate",
                data: dataWr.map(winrate => winrate.winrate),
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
