import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './Excel/FileUpload';
import SheetSelector from './Excel/SheetSelector';
import TableComponent from './Excel/TableComponent';
import PaginationComponent from './Excel/PaginationComponent';
import SaveButton from './Excel/SaveButton';
import SearchComponent from './Excel/SearchComponent';
import ContextMenu from './Excel/ContextMenu';
import '../css/ExcelReader.css';

const ExcelReader = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [binaryStr, setBinaryStr] = useState('');
    const [editingCell, setEditingCell] = useState({ rowIndex: null, columnId: null });
    const [hasChanges, setHasChanges] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [contextMenuPosition, setContextMenuPosition] = useState(null);
    const [contextMenuOptions, setContextMenuOptions] = useState([]);
    const [renamingHeader, setRenamingHeader] = useState(null); // Store which column is being renamed


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
                    acc[header] = row[index] || '';
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
                acc[header] = row[index] || '';
                return acc;
            }, {});
        });
        setData(rowData);
        setHasChanges(false);
        setCurrentPage(0);
    };

    const handleCellDoubleClick = (rowIndex, columnId) => {
        setEditingCell({ rowIndex, columnId });
    };

    const handleCellChange = (rowIndex, columnId, value) => {
        const updatedData = [...data];
        updatedData[rowIndex][columnId] = value;
        setData(updatedData);
        setEditingCell({ rowIndex: null, columnId: null });
        setHasChanges(true);
    };

    const handleKeyPress = (e, rowIndex, columnId, value) => {
        if (e.key === 'Enter') {
            handleCellChange(rowIndex, columnId, value);
        }
    };

    const saveAsExcel = () => {
        const updatedSheetData = [
            columns.map(col => col.Header),
            ...data.map(row => columns.map(col => row[col.accessor]))
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(updatedSheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, selectedSheet);

        XLSX.writeFile(workbook, 'updated_data.xlsx');
        setHasChanges(false);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(0);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const filteredData = data.filter(row => {
        return Object.values(row).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleRightClick = (e, rowIndex) => {
        e.preventDefault();
        setContextMenuPosition({ x: e.pageX, y: e.pageY });

        const options = [
            { label: 'Add Row Above', action: () => addRowAbove(rowIndex) },
            { label: 'Add Row Below', action: () => addRowBelow(rowIndex) },
            { label: 'Delete Row', action: () => deleteRow(rowIndex) },
        ];

        setContextMenuOptions(options);
    };

    const addRowAbove = (rowIndex) => {
        const newRow = columns.reduce((acc, col) => {
            acc[col.accessor] = '';
            return acc;
        }, {});
        const updatedData = [...data.slice(0, rowIndex), newRow, ...data.slice(rowIndex)];
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null);
    };

    const addRowBelow = (rowIndex) => {
        const newRow = columns.reduce((acc, col) => {
            acc[col.accessor] = '';
            return acc;
        }, {});
        const updatedData = [...data.slice(0, rowIndex + 1), newRow, ...data.slice(rowIndex + 1)];
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null);
    };

    const deleteRow = (rowIndex) => {
        const updatedData = data.filter((_, index) => index !== rowIndex);
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null);
    };

    // for column
    const handleHeaderRightClick = (e, colIndex) => {
        e.preventDefault();
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
    
        const options = [
            { label: 'Add Column Left', action: () => addColumnLeft(colIndex) },
            { label: 'Add Column Right', action: () => addColumnRight(colIndex) },
            { label: 'Delete Column', action: () => deleteColumn(colIndex) },
        ];
    
        setContextMenuOptions(options);
    };

    const addColumnLeft = (colIndex) => {
        const newColumn = { Header: `New Column ${columns.length + 1}`, accessor: `new_col_${columns.length + 1}` };
    
        // Insert the new column at the specified index
        const updatedColumns = [...columns.slice(0, colIndex), newColumn, ...columns.slice(colIndex)];
        setColumns(updatedColumns);
    
        // Add the new column to every row in the data
        const updatedData = data.map(row => ({
            ...row,
            [newColumn.accessor]: '', // Initialize new column with empty values
        }));
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null); // Close the context menu
    };
    
    // Add a column to the right of the current column
    const addColumnRight = (colIndex) => {
        const newColumn = { Header: `New Column ${columns.length + 1}`, accessor: `new_col_${columns.length + 1}` };
    
        // Insert the new column at the specified index
        const updatedColumns = [...columns.slice(0, colIndex + 1), newColumn, ...columns.slice(colIndex + 1)];
        setColumns(updatedColumns);
    
        // Add the new column to every row in the data
        const updatedData = data.map(row => ({
            ...row,
            [newColumn.accessor]: '', // Initialize new column with empty values
        }));
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null); // Close the context menu
    };
    
    // Delete the selected column
    const deleteColumn = (colIndex) => {
        const columnAccessor = columns[colIndex].accessor;
    
        // Remove the column from the columns array
        const updatedColumns = columns.filter((_, index) => index !== colIndex);
        setColumns(updatedColumns);
    
        // Remove the column data from every row in the data
        const updatedData = data.map(row => {
            const { [columnAccessor]: _, ...rest } = row; // Remove the column by destructuring
            return rest;
        });
        setData(updatedData);
        setHasChanges(true);
        setContextMenuPosition(null); // Close the context menu
    };

    const handleHeaderDoubleClick = (colIndex) => {
        setRenamingHeader(colIndex); // Set the column index to enable renaming
    };

    // Handle header name change when the user finishes editing
    const handleHeaderNameChange = (e, colIndex) => {
        const newHeaderName = e.target.value;
    
        // Update only the column headers with the new name, keep accessor the same
        const updatedColumns = columns.map((col, index) => {
            if (index === colIndex) {
                return { ...col, Header: newHeaderName }; // Only update the header, leave accessor unchanged
            }
            return col;
        });
    
        setColumns(updatedColumns);
        setRenamingHeader(null); // Exit renaming mode
    };
    

    // Handle key press for renaming (to save on Enter key)
    const handleHeaderKeyPress = (e, colIndex) => {
        if (e.key === 'Enter') {
            handleHeaderNameChange(e, colIndex); // Trigger name change when Enter is pressed
        }
    };
    

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
                    onSearchChange={setSearchTerm} 
                />
            </div>
            <div className="table-container">
            <TableComponent
                data={paginatedData}
                columns={columns}
                editingCell={editingCell}
                onCellDoubleClick={handleCellDoubleClick}
                onCellChange={handleCellChange}
                onKeyPress={handleKeyPress}
                onRightClick={handleRightClick} // For row right-click
                onHeaderRightClick={handleHeaderRightClick} // For column right-click
                onHeaderDoubleClick={handleHeaderDoubleClick} // Double-click for renaming header
                renamingHeader={renamingHeader} // Pass the column being renamed
                handleHeaderNameChange={handleHeaderNameChange} // Handle header name change
                handleHeaderKeyPress={handleHeaderKeyPress} // Handle renaming key press (Enter key)
            />
            {contextMenuPosition && (
                <ContextMenu
                    options={contextMenuOptions}
                    position={contextMenuPosition}
                    onClose={() => setContextMenuPosition(null)}
                />
            )}
        </div>
            {filteredData.length > 0 && (
                <PaginationComponent
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    totalRows={filteredData.length}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ExcelReader;
