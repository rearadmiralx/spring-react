import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useTable } from 'react-table';

const ExcelReader = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const sheetNames = workbook.SheetNames;
      setSheetNames(sheetNames);
      setSelectedSheet(sheetNames[0]);

      const worksheet = workbook.Sheets[sheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = sheetData[0].map((header) => ({ Header: header, accessor: header }));
      setColumns(headers);
      setData(sheetData.slice(1));
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
    setData(sheetData.slice(1));
  };

  const tableInstance = useTable({ columns, data });

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {sheetNames.length > 0 && (
        <select value={selectedSheet} onChange={handleSheetChange}>
          {sheetNames.map((sheetName) => (
            <option key={sheetName} value={sheetName}>
              {sheetName}
            </option>
          ))}
        </select>
      )}
      <table {...tableInstance.getTableProps()}>
        <thead>
          {tableInstance.headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...tableInstance.getTableBodyProps()}>
          {tableInstance.rows.map((row) => {
            tableInstance.prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelReader;

