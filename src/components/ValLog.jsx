import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InsertMatch.css';

const InsertMatch = () => {
    const [rows, setRows] = useState([]);

    const valorantMaps = ["Ascent", "Bind", "Breeze", "Fracture", "Haven", "Icebox", "Lotus", "Pearl", "Split"].sort();

    const agents = [
        "Brimstone", "Viper", "Omen", "Killjoy", "Cypher", 
        "Sova", "Sage", "Phoenix", "Jett", "Reyna", 
        "Raze", "Breach", "Skye", "Yoru", "Astra", 
        "KAY/O", "Chamber", "Neon", "Fade", "Harbor",
        "Gekko", "Clove"
    ].sort();

    useEffect(() => {
        const fetchGameLogs = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/valgamelogs/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching game logs:', error);
            }
        };

        fetchGameLogs();
    }, []);

    const addNewRow = () => {
        const newRow = { valDate: '', valMap: '', valResult: '', agent: '', start: '', kills: '', assist: '', death: '', econScore: '', plants: '', defuses: '', combatScore: '' };
        setRows([...rows, newRow]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const valDate = new Date(dateString);
        return valDate.toISOString().split('T')[0]; // Convert to yyyy-MM-dd
    };

    const handleInputChange = (index, event) => {
        const updatedRows = [...rows];
        updatedRows[index][event.target.name] = event.target.value;
        setRows(updatedRows);
    };

    const handleSaveRow = async (index) => {
        const token = localStorage.getItem('authToken');
        const row = rows[index];
        try {
            await axios.post('http://127.0.0.1:8000/api/valgamelogs/', row, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('Game log added:', row);
        } catch (error) {
            console.error('Error adding game log:', error);
        }
    };

    const handleDeleteRow = async (index) => {
        const token = localStorage.getItem('authToken');
        const row = rows[index];
        try {
            await axios.delete(`http://127.0.0.1:8000/api/valgamelogs/${row.id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            const updatedRows = rows.filter((_, i) => i !== index);
            setRows(updatedRows);
            console.log('Game log deleted:', row); 
        } catch (error) {
            console.error('Error deleting game log:', error);
        }
    }

    


    return (
        <div>
            {rows.map((row, index) => (
                <div key={index}>
                    <input
                        type="date"
                        name="valDate"
                        value={formatDate(row.valDate)}
                        onChange={event => handleInputChange(index, event)}
                    />
                    <select
                        name="valMap"
                        value={row.valMap}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Map</option>
                        {valorantMaps.map(map => (
                            <option key={map} value={map}>{map}</option>
                        ))}
                    </select>
                    <select
                        name="valResult"
                        value={row.valResult}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Result</option>
                        <option value="Win">Win</option>
                        <option value="Loss">Loss</option>
                        <option value="Draw">Draw</option>
                    </select>
                    <select
                        name="agent"
                        value={row.agent}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Agent</option>
                        {agents.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        name="valStart"
                        value={row.valStart}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Start</option>
                        <option value="Attack">Attacking</option>
                        <option value="Defend">Defending</option>
                    </select>
                    <input
                        type="number"
                        name="kills"
                        value={row.kills}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Kills'
                    />
                    <input
                        type="number"
                        name="assist"
                        value={row.assist}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Assists'
                    />
                    <input
                        type="number"
                        name="death"
                        value={row.death}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Deaths'
                    />
                    <input
                        type="number"
                        name="econRating"
                        value={row.econRating}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Econ Score'
                    />
                    <input
                        type="number"
                        name="plants"
                        value={row.plants}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Plants'
                    />
                    <input
                        type="number"
                        name="defuses"
                        value={row.defuses}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Defuses'
                    />
                    <input
                        type="number"
                        name="combatScore"
                        value={row.combatScore}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Combat Score'
                    />
                    <button type="button" onClick={() => handleSaveRow(index)}>Save</button>
                    <button type="button" onClick={() => handleDeleteRow(index)}>Delete</button>
                </div>
            ))}
            <button type="button" onClick={addNewRow}>Add New Row</button>
        </div>
    );
};

export default InsertMatch;
