import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './Excel/FileUpload';
import SheetSelector from './Excel/SheetSelector';
import TableComponent from './Excel/TableComponent';
import PaginationComponent from './Excel/PaginationComponent';
import SaveButton from './Excel/SaveButton';
import SearchComponent from './Excel/SearchComponent'; // Import the SearchComponent
import '../css/ExcelReader.css'; // Custom styling

const ExcelReader = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [binaryStr, setBinaryStr] = useState('');
    const [editingCell, setEditingCell] = useState({ rowIndex: null, columnId: null });
    const [hasChanges, setHasChanges] = useState(false); // State to track changes
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term


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
        setCurrentPage(0); // Reset to first page when sheet changes
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

    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(0); // Reset to first page when changing rows per page
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Filter data based on search term
    const filteredData = data.filter(row => {
        return Object.values(row).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const paginatedData = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

    return (
        <div className="container">
            <div className="controls">
                <FileUpload onFileUpload={handleFileUpload} />
                <SheetSelector 
                    sheetNames={sheetNames} 
                    selectedSheet={selectedSheet} 
                    onSheetChange={handleSheetChange} 
                />
                {hasChanges && <SaveButton onSave={saveAsExcel} />}
                <SearchComponent 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} // Update search term based on input
                />
            </div>
            <div className="table-container">
                <TableComponent 
                    data={paginatedData} // Pass only paginated items for display
                    columns={columns} 
                    editingCell={editingCell} 
                    onCellDoubleClick={handleCellDoubleClick} 
                    onCellChange={handleCellChange} 
                    onKeyPress={handleKeyPress} 
                />
            </div>
            {filteredData.length > 0 && ( // Only show table and pagination if there's filtered data
                <PaginationComponent
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalRows={filteredData.length} // Pass total filtered rows
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ExcelReader;
