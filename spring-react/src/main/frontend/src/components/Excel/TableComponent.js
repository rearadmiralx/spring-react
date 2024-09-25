import React from 'react';
import { useTable } from 'react-table';

const TableComponent = ({
    data,
    columns,
    editingCell,
    onCellDoubleClick,
    onCellChange,
    onKeyPress,
    onRightClick,
    onHeaderRightClick, // For column headers
    onHeaderDoubleClick, // To rename column headers
    renamingHeader, // Pass the column being renamed
    handleHeaderNameChange, // To handle header name change
    handleHeaderKeyPress, // To handle renaming completion
}) => {
    const tableInstance = useTable({ columns, data });

    return (
        <table {...tableInstance.getTableProps()} className="excel-table">
            <thead>
                {tableInstance.headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
                        {headerGroup.headers.map((column, colIndex) => (
                            <th
                                {...column.getHeaderProps()}
                                onContextMenu={(e) => onHeaderRightClick(e, colIndex)} // Handle right-click on header
                                onDoubleClick={() => onHeaderDoubleClick(colIndex)} // Handle double-click on header
                            >
                                {renamingHeader === colIndex ? (
                                    <input
                                        type="text"
                                        defaultValue={column.Header}
                                        onBlur={(e) => handleHeaderNameChange(e, colIndex)}
                                        onKeyPress={(e) => handleHeaderKeyPress(e, colIndex)}
                                        autoFocus
                                    />
                                ) : (
                                    column.render('Header')
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...tableInstance.getTableBodyProps()}>
                {tableInstance.rows.map((row) => {
                    tableInstance.prepareRow(row);
                    const { key, ...rowProps } = row.getRowProps();

                    return (
                        <tr 
                            {...rowProps} 
                            key={key} 
                            className="data-row"
                            onContextMenu={(e) => {
                                e.preventDefault();
                                onRightClick(e, row.index);
                            }}
                        >
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    onDoubleClick={() => onCellDoubleClick(row.index, cell.column.id)}
                                >
                                    {editingCell.rowIndex === row.index && editingCell.columnId === cell.column.id ? (
                                        <input
                                            type="text"
                                            defaultValue={cell.value}
                                            onBlur={(e) => onCellChange(row.index, cell.column.id, e.target.value)}
                                            onKeyPress={(e) => onKeyPress(e, row.index, cell.column.id, e.target.value)}
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
