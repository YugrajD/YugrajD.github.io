import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameLogAnalysis.css';

const GameLogAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [filteredAnalysis, setFilteredAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMap, setSelectedMap] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const overwatchMaps = [
        "Ilios", "Lijiang Tower", "Nepal", "Oasis", "Busan", "Antarctic Peninsula",
        "Dorado", "Route 66", "Watchpoint: Gibraltar", "Junkertown", "Rialto", "Havana",
        "Shambali Monastery", "New Junk City", "Eichenwalde", "Hollywood", "King's Row",
        "Numbani", "Blizzard World", "Midtown", "Paraíso", "New Queen Street", "Colosseo",
        "Esperança", "Suravasa", "Circuit Royal"
    ].sort();

    const roles = ['Tank', 'Damage', 'Support'];

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Get the token from localStorage
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://127.0.0.1:8000/api/analyze/', {
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

    const handleMapChange = (event) => {
        setSelectedMap(event.target.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleFilterSubmit = () => {
        if (!analysis || !analysis.logs) {
            console.error('No analysis data available', analysis);
            return;
        }
        
        let filteredLogs = analysis.logs;

        if (selectedMap) {
            filteredLogs = filteredLogs.filter(log => log.map === selectedMap);
        }

        if(selectedRole) {
            filteredLogs = filteredLogs.filter(log => log.role === selectedRole);
        }

        console.log('Filtered Logs:', filteredLogs);

        if (filteredLogs.length > 0) {
            const winLossRatio = filteredLogs.reduce((acc, log) => {
                acc[log.result] = (acc[log.result] || 0) + 1;
                return acc;
            }, {});
            const averageStats = filteredLogs.reduce((acc, log) => {
                acc.eliminations += log.eliminations;
                acc.assists += log.assists;
                acc.deaths += log.deaths;
                acc.damage += log.damage;
                acc.healing += log.healing;
                acc.mitigation += log.mitigation;
                return acc;
            }, { eliminations: 0, assists: 0, deaths: 0, damage: 0, healing: 0, mitigation: 0 });

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
                <select id="mapFilter" value={selectedMap} onChange={handleMapChange}>
                    <option value="">All Maps</option>
                    {overwatchMaps.map(map => (
                        <option key={map} value={map}>{map}</option>
                    ))}
                </select>
                <label htmlFor="roleFilter">Filter by Role:</label>
                <select id="roleFilter" value={selectedRole} onChange={handleRoleChange}>
                    <option value="">All Roles</option>
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
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
                <p>Eliminations: {filteredAnalysis?.average_stats?.eliminations?.toFixed(2)}</p>
                <p>Assists: {filteredAnalysis?.average_stats?.assists?.toFixed(2)}</p>
                <p>Deaths: {filteredAnalysis?.average_stats?.deaths?.toFixed(2)}</p>
                <p>Damage: {filteredAnalysis?.average_stats?.damage?.toFixed(2)}</p>
                <p>Healing: {filteredAnalysis?.average_stats?.healing?.toFixed(2)}</p>
                <p>Mitigation: {filteredAnalysis?.average_stats?.mitigation?.toFixed(2)}</p>
            </div>
            <div>
                <h2>Performance Trends</h2>
                {/* Add your chart or graph here for performance trends */}
            </div>
        </div>
    );
};

export default GameLogAnalysis;