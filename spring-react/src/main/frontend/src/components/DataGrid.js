// DataGrid.js
import React, { useEffect, useState } from 'react';
import DataGrid from 'react-data-grid';

const columns = [
    { key: 'id', name: 'ID', editable: false },
    { key: 'name', name: 'Name', editable: true },
    { key: 'age', name: 'Age', editable: true },
    { key: 'email', name: 'Email', editable: true }
];

function ExcelDataGrid({ data, onSave }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data.length) {
            const transformedData = data.map((row, index) => ({
                id: index,
                name: row[0] || '',
                age: row[1] || '',
                email: row[2] || ''
            }));
            setRows(transformedData);
        }
    }, [data]);

    const handleRowChange = (rowIndex, updatedRow) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
        setRows(updatedRows);
    };

    const handleSave = () => {
        const savedData = rows.map(row => [row.name, row.age, row.email]);
        onSave(savedData);
    };

    return (
        <div>
            <DataGrid
                columns={columns}
                rows={rows}
                onRowsChange={handleRowChange}
                editable
                style={{ height: '400px', width: '100%' }}
            />
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
}

export default ExcelDataGrid;