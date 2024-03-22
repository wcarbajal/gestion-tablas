import React from "react";
import "./table.css";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,

} from "@tanstack/react-table";
import { columnDefWithCheckBox } from "./columns";
import dataJSON from "./data.json";
import FilterFunction from "./FilterFunction";

const BasicTable = () => {
    const finalData = React.useMemo(() => dataJSON, []);
    const finalColumnDef = React.useMemo(() => columnDefWithCheckBox, []);

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);

    const tableInstance = useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        state: {
            rowSelection: rowSelection,
            columnFilters: columnFilters,
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        onColumnFiltersChange: setColumnFilters,
    });

    //   console.log("test", tableInstance.getHeaderGroups());

    return (
        <>
            <table>
                <thead>
                    {tableInstance.getHeaderGroups().map((headerEl) => {
                        return (
                            <tr key={headerEl.id}>
                                {headerEl.headers.map((columnEl) => {
                                    return (
                                        <th key={columnEl.id} colSpan={columnEl.colSpan}>
                                            {columnEl.isPlaceholder ? null : (
                                                <>
                                                    {flexRender(
                                                        columnEl.column.columnDef.header,
                                                        columnEl.getContext()
                                                    )}
                                                    {columnEl.column.getCanFilter() ? (
                                                        <div>
                                                            <FilterFunction
                                                                column={columnEl.column}
                                                                table={tableInstance}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody>
                    {tableInstance.getRowModel().rows.map((rowEl) => {
                        return (
                            <tr key={rowEl.id}>
                                {rowEl.getVisibleCells().map((cellEl) => {
                                    return (
                                        <td key={cellEl.id}>
                                            {flexRender(
                                                cellEl.column.columnDef.cell,
                                                cellEl.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <h3> Seleccion</h3>
            <hr />
            <div>
                <ul>
                    {tableInstance.getSelectedRowModel().flatRows.map((el) => {
                        return <li key={el.id}>{JSON.stringify(el.original)}</li>;
                    })}
                </ul>
            </div>
            <hr />
            <hr />
            <div>
                <button
                    onClick={() => tableInstance.setPageIndex(0)}
                    disabled={!tableInstance.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    onClick={() => tableInstance.previousPage()}
                    disabled={!tableInstance.getCanPreviousPage()}
                >
                    Previous Page
                </button>
                <button
                    onClick={() => tableInstance.nextPage()}
                    disabled={!tableInstance.getCanNextPage()}
                >
                    Next Page
                </button>
                <button
                    onClick={() =>
                        tableInstance.setPageIndex(tableInstance.getPageCount() - 1)
                    }
                    disabled={!tableInstance.getCanNextPage()}
                >
                    {">>"}
                </button>
            </div>
            <hr />
            <ul>
                <li>
                    You are on page number:{" "}
                    {tableInstance.options.state.pagination.pageIndex + 1}
                </li>
                <li>Total pages: {tableInstance.getPageCount()}</li>
            </ul>
            <hr />
            <input
                type="number"
                defaultValue={tableInstance.options.state.pagination.pageIndex + 1}
                onChange={(e) => tableInstance.setPageIndex(e.target.value)}
            />
            <hr />
            <h4>
                Current page size: {tableInstance.options.state.pagination.pageSize}
            </h4>
            <select
                value={tableInstance.options.state.pagination.pageSize}
                onChange={(e) => tableInstance.setPageSize(e.target.value)}
            >
                {[5, 10, 25, 50].map((pageSizeEl) => {
                    return (
                        <option key={pageSizeEl} value={pageSizeEl}>
                            {pageSizeEl}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default BasicTable;
