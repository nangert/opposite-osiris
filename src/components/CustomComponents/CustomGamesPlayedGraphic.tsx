import type { Match } from "@components/Interfaces";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

interface GamesChartProps {
    matches: Match[];
}

interface GamesPerDay {
    date: number;
    games: number;
}

interface RollingAverages {
    date: number;
    average: number;
}

const GamesChart = ({ matches }: GamesChartProps) => {
    const [averages, setAverages] = useState<RollingAverages[]>([]);
    const startDate = new Date("2022-12-18").getTime();

    const calculateGamesPerWeek = (matches: Match[], startDate: number) => {
        let weekStartDate = new Date(startDate);
        let weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 7);

        let gamesPerWeek = new Map();

        // Create a map for all the weeks from start date to current date
        while (weekStartDate <= new Date()) {
            gamesPerWeek.set(weekStartDate.getTime(), 0);
            weekStartDate = new Date(weekStartDate);
            weekStartDate.setDate(weekStartDate.getDate() + 7);
        }

        matches.forEach(match => {
            let matchDate = new Date(match.created_at);

            // Increment the count for the week of the match
            if (matchDate >= weekStartDate && matchDate < weekEndDate) {
                gamesPerWeek.set(weekStartDate.getTime(), gamesPerWeek.get(weekStartDate.getTime()) + 1);
            } else {
                while (weekEndDate <= matchDate) {
                    weekStartDate = new Date(weekEndDate);
                    weekEndDate.setDate(weekEndDate.getDate() + 7);
                }
                gamesPerWeek.set(weekStartDate.getTime(), gamesPerWeek.get(weekStartDate.getTime()) + 1);
            }
        });

        let gamesPerWeekArray = Array.from(gamesPerWeek, ([date, games]) => ({ date, games }));

        return gamesPerWeekArray;
    };

    function calculateRollingAverage(data: GamesPerDay[], windowSize: number) {
        let results = [];
        let tempSum = 0;

        for (let i = 0; i < data.length; i++) {
            tempSum += data[i].games;

            if (i >= windowSize) {
                tempSum -= data[i - windowSize].games;
            }

            let average = tempSum / windowSize;
            results.push({ date: data[i].date, average: average });
        }

        return results;
    }

    useEffect(() => {
        const gamesPerWeek = calculateGamesPerWeek(matches, startDate);
        const rollingAverages = calculateRollingAverage(gamesPerWeek, 1); // 4 weeks rolling average
        setAverages(rollingAverages);
    }, [matches]);

    const data = {
        labels: averages.map(day => new Date(day.date).toLocaleDateString()),
        datasets: [
            {
                label: "Games Played",
                data: averages.map(day => day.average),
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1, // You can adjust this value to get the desired smoothing
            },
        ],
    };

    return (
        <div>
            <Line data={data} />
        </div>
    );
};

export default GamesChart;
