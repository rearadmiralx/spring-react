import React from 'react';
import { useTable } from 'react-table';

const TableComponent = ({ data, columns, editingCell, onCellDoubleClick, onCellChange, onKeyPress }) => {
    const tableInstance = useTable({ columns, data });

    return (
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
                                <td 
                                    {...cell.getCellProps()} 
                                    onDoubleClick={() => onCellDoubleClick(rowIndex, cell.column.id)}
                                >
                                    {editingCell.rowIndex === rowIndex && editingCell.columnId === cell.column.id ? (
                                        <input
                                            type="text"
                                            defaultValue={cell.value}
                                            onBlur={(e) => onCellChange(rowIndex, cell.column.id, e.target.value)}
                                            onKeyPress={(e) => onKeyPress(e, rowIndex, cell.column.id, e.target.value)}
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
    );
};

export default TableComponent;