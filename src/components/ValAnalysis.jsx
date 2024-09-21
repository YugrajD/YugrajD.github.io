import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameLogAnalysis.css';

const GameLogAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [filteredAnalysis, setFilteredAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedValMap, setSelectedValMap] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');

    const valorantMaps = ["Ascent", "Bind", "Breeze", "Fracture", "Haven", "Icebox", "Lotus", "Pearl", "Split"].sort();
    const agents = [
        "Brimstone", "Viper", "Omen", "Killjoy", "Cypher", 
        "Sova", "Sage", "Phoenix", "Jett", "Reyna", 
        "Raze", "Breach", "Skye", "Yoru", "Astra", 
        "KAY/O", "Chamber", "Neon", "Fade", "Harbor",
        "Gekko", "Clove"
    ].sort();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Get the token from localStorage
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/valanalyze/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                console.log('Fetched Data:', response.data);  // Log the fetched data
                setAnalysis(response.data);
                setFilteredAnalysis(response.data); // Initially show the general analysis
            } catch (err) {
                console.error('Error fetching data:', err);  // Log any errors
                setError(err.message || 'An error occurred'); // Set a string as the error message
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    const handleValMapChange = (event) => {
        setSelectedValMap(event.target.value);
    };

    const handleAgentChange = (event) => {
        setSelectedAgent(event.target.value);
    };

    const handleFilterSubmit = () => {
        if (!analysis || !analysis.logs) {
            console.error('No analysis data available', analysis);
            return;
        }
        
        let filteredLogs = analysis.logs;

        if (selectedValMap) {
            filteredLogs = filteredLogs.filter(log => log.valMap === selectedValMap);
        }

        if(selectedAgent) {
            filteredLogs = filteredLogs.filter(log => log.agent === selectedAgent);
        }

        console.log('Filtered Logs:', filteredLogs);

        if (filteredLogs.length > 0) {
            const winLossRatio = filteredLogs.reduce((acc, log) => {
                acc[log.valResult] = (acc[log.valResult] || 0) + 1;
                return acc;
            }, {});
            const averageStats = filteredLogs.reduce((acc, log) => {
                acc.kills += log.kills;
                acc.assist += log.assist;
                acc.death += log.death;
                acc.plants += log.plants;
                acc.defuses += log.defuses;
                acc.combatScore += log.combatScore;
                acc.econRating += log.econRating;
                return acc;
            }, { kills: 0, assist: 0, death: 0, plants: 0, defuses: 0, combatScore: 0, econRating: 0});

            Object.keys(averageStats).forEach(key => {
                averageStats[key] /= filteredLogs.length;
            });

            const filteredData = {
                win_loss_ratio: winLossRatio,
                average_stats: averageStats,
                performance_trends: {} // Add performance trends processing if needed
            };

            console.log('Filtered Data:', filteredData);
            setFilteredAnalysis(filteredData);
        } else {
            setFilteredAnalysis(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>; // Ensure error is a string
    }

    return (
        <div>
            <h1>Game Analysis</h1>
            <div>
                <label htmlFor="mapFilter">Filter by Map:</label>
                <select id="mapFilter" value={selectedValMap} onChange={handleValMapChange}>
                    <option value="">All Maps</option>
                    {valorantMaps.map(map => (
                        <option key={map} value={map}>{map}</option>
                    ))}
                </select>
                <label htmlFor="roleFilter">Filter by Role:</label>
                <select id="roleFilter" value={selectedAgent} onChange={handleAgentChange}>
                    <option value="">All Agents</option>
                    {agents.map(agent => (
                        <option key={agent} value={agent}>{agent}</option>
                    ))}
                </select>
                <button onClick={handleFilterSubmit}>Submit</button>
            </div>
            <div>
                <h2>Win/Loss Ratio</h2>
                <p>Wins: {filteredAnalysis?.win_loss_ratio?.Win || 0}</p>
                <p>Losses: {filteredAnalysis?.win_loss_ratio?.Loss || 0}</p>
                <p>Draws: {filteredAnalysis?.win_loss_ratio?.Draw || 0}</p>
            </div>
            <div>
                <h2>Average Stats</h2>
                <p>Kills: {filteredAnalysis?.average_stats?.kills?.toFixed(2)}</p>
                <p>Assists: {filteredAnalysis?.average_stats?.assist?.toFixed(2)}</p>
                <p>Deaths: {filteredAnalysis?.average_stats?.death?.toFixed(2)}</p>
                <p>Plants: {filteredAnalysis?.average_stats?.plants?.toFixed(2)}</p>
                <p>Defuses: {filteredAnalysis?.average_stats?.defuses?.toFixed(2)}</p>
                <p>Combat score: {filteredAnalysis?.average_stats?.combatScore?.toFixed(2)}</p>
                <p>Econ Rating: {filteredAnalysis?.average_stats?.econRating?.toFixed(2)}</p>
            </div>
            <div>
                <h2>Performance Trends</h2>
                {/* Add your chart or graph here for performance trends */}
            </div>
        </div>
    );
};

export default GameLogAnalysis;