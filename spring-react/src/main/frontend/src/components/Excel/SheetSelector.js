import React from 'react';

const SheetSelector = ({ sheetNames, selectedSheet, onSheetChange }) => {
    return (
        sheetNames.length > 0 && (
            <select value={selectedSheet} onChange={onSheetChange} className="sheet-dropdown">
                {sheetNames.map((sheetName) => (
                    <option key={sheetName} value={sheetName}>
                        {sheetName}
                    </option>
                ))}
            </select>
        )
    );
};

export default SheetSelector;