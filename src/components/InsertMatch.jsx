import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InsertMatch.css';

const InsertMatch = () => {
    const [rows, setRows] = useState([]);

    const overwatchMaps = [
        "Ilios", "Lijiang Tower", "Nepal", "Oasis", "Busan", "Antarctic Peninsula",
        "Dorado", "Route 66", "Watchpoint: Gibraltar", "Junkertown", "Rialto", "Havana",
        "Shambali Monastery", "New Junk City", "Eichenwalde", "Hollywood", "King's Row",
        "Numbani", "Blizzard World", "Midtown", "Paraíso", "New Queen Street", "Colosseo",
        "Esperança", "Suravasa", "Circuit Royal"
    ].sort();

    const roles = ['Tank', 'Damage', 'Support'];

    useEffect(() => {
        const fetchGameLogs = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/gamelogs/', {
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
        const newRow = { date: '', map: '', result: '', role: '', eliminations: '', assists: '', deaths: '', damage: '', healing: '', mitigation: '' };
        setRows([...rows, newRow]);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Convert to yyyy-MM-dd
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
            await axios.post('http://127.0.0.1:8000/api/gamelogs/', row, {
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
            await axios.delete(`http://127.0.0.1:8000/api/gamelogs/${row.id}/`, {
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
                        name="date"
                        value={formatDate(row.date)}
                        onChange={event => handleInputChange(index, event)}
                    />
                    <select
                        name="map"
                        value={row.map}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Map</option>
                        {overwatchMaps.map(map => (
                            <option key={map} value={map}>{map}</option>
                        ))}
                    </select>
                    <select
                        name="result"
                        value={row.result}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Result</option>
                        <option value="Win">Win</option>
                        <option value="Loss">Loss</option>
                        <option value="Draw">Draw</option>
                    </select>
                    <select
                        name="role"
                        value={row.role}
                        onChange={event => handleInputChange(index, event)}
                    >
                        <option value="" disabled>Select Role</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="eliminations"
                        value={row.eliminations}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Eliminations'
                    />
                    <input
                        type="number"
                        name="assists"
                        value={row.assists}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Assists'
                    />
                    <input
                        type="number"
                        name="deaths"
                        value={row.deaths}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Deaths'
                    />
                    <input
                        type="number"
                        name="damage"
                        value={row.damage}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Damage'
                    />
                    <input
                        type="number"
                        name="healing"
                        value={row.healing}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Healing'
                    />
                    <input
                        type="number"
                        name="mitigation"
                        value={row.mitigation}
                        onChange={event => handleInputChange(index, event)}
                        placeholder='Mitigation'
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
