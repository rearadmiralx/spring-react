import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useTable } from 'react-table';
import '../css/ExcelReader.css'; // Custom styling

const ExcelReader = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [binaryStr, setBinaryStr] = useState('');
    const [editingCell, setEditingCell] = useState({ rowIndex: null, columnId: null });
    const [hasChanges, setHasChanges] = useState(false); // State to track changes

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            setBinaryStr(binaryStr);
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            const sheetNames = workbook.SheetNames;
            setSheetNames(sheetNames);
            setSelectedSheet(sheetNames[0]);

            const worksheet = workbook.Sheets[sheetNames[0]];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = sheetData[0].map((header) => ({ Header: header, accessor: header }));
            setColumns(headers);

            const rowData = sheetData.slice(1).map((row) => {
                return sheetData[0].reduce((acc, header, index) => {
                    acc[header] = row[index] || ''; // Assign each cell to corresponding header
                    return acc;
                }, {});
            });
            setData(rowData);
        };

        reader.readAsBinaryString(file);
    };

    const handleSheetChange = (event) => {
        const sheetName = event.target.value;
        setSelectedSheet(sheetName);

        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = sheetData[0].map((header) => ({ Header: header, accessor: header }));
        setColumns(headers);

        const rowData = sheetData.slice(1).map((row) => {
            return sheetData[0].reduce((acc, header, index) => {
                acc[header] = row[index] || ''; // Assign each cell to corresponding header
                return acc;
            }, {});
        });
        setData(rowData);
        setHasChanges(false); // Reset change tracking when loading a new sheet
    };

    // Handle double-click to start editing a cell
    const handleCellDoubleClick = (rowIndex, columnId) => {
        setEditingCell({ rowIndex, columnId });
    };

    // Handle updating the cell value
    const handleCellChange = (rowIndex, columnId, value) => {
        const updatedData = [...data];
        updatedData[rowIndex][columnId] = value;
        setData(updatedData);
        setEditingCell({ rowIndex: null, columnId: null });
        setHasChanges(true); // Mark as changed
    };

    // Handle keypress event to save changes when pressing Enter
    const handleKeyPress = (e, rowIndex, columnId, value) => {
        if (e.key === 'Enter') {
            handleCellChange(rowIndex, columnId, value);
        }
    };

    // Save the updated data as Excel file
    const saveAsExcel = () => {
        const updatedSheetData = [
            columns.map(col => col.Header), // Headers
            ...data.map(row => columns.map(col => row[col.accessor])) // Rows
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(updatedSheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, selectedSheet);

        // Download Excel file
        XLSX.writeFile(workbook, 'updated_data.xlsx');
        setHasChanges(false); // Reset change tracking after saving
    };

    const tableInstance = useTable({ columns, data });

    return (
        <div className="container">
            <div className="controls">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="upload-button" />
                
                {sheetNames.length > 0 && (
                    <select value={selectedSheet} onChange={handleSheetChange} className="sheet-dropdown">
                        {sheetNames.map((sheetName) => (
                            <option key={sheetName} value={sheetName}>
                                {sheetName}
                            </option>
                        ))}
                    </select>
                )}

                {/* Conditionally render the button based on hasChanges */}
                {hasChanges && (
                    <button onClick={saveAsExcel} className="save-button">Save and Download</button>
                )}
            </div>

            <div className="table-container">
                <table {...tableInstance.getTableProps()} className="excel-table">
                    <thead>
                        {tableInstance.headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...tableInstance.getTableBodyProps()}>
                        {tableInstance.rows.map((row, rowIndex) => {
                            tableInstance.prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="data-row">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} onDoubleClick={() => handleCellDoubleClick(rowIndex, cell.column.id)}>
                                            {editingCell.rowIndex === rowIndex && editingCell.columnId === cell.column.id ? (
                                                <input
                                                    type="text"
                                                    defaultValue={cell.value}
                                                    onBlur={(e) => handleCellChange(rowIndex, cell.column.id, e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, rowIndex, cell.column.id, e.target.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                cell.render('Cell')
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExcelReader;