import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

export default function TableComponent({
  data,
  columns,
  isPagination,
  isHeaderDisplay = true,
  noDataMessage = 'データなし'
}: {
  data: any[];
  isPagination?: boolean;
  columns: ColumnDef<any>[];
  isHeaderDisplay?: boolean;
  noDataMessage?: string;
}) {
  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  // Check if data is empty or undefined
  const isNoData = !data || data?.length === 0;

  return (
    <div className="overflow-x-auto w-full bg-gray-50 shadow-lg rounded-lg">
      <table className="min-w-full border-collapse table-auto divide-y divide-gray-200">
        {isHeaderDisplay && (
          <thead className="bg-gray-800 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup?.id}>
                {headerGroup?.headers.map((header) => (
                  <th
                    key={header?.id}
                    colSpan={header?.colSpan}
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-700 whitespace-nowrap">
                    <div
                      {...{
                        className: header?.column?.getCanSort()
                          ? 'cursor-pointer select-none flex items-center justify-center'
                          : 'flex items-center justify-center',
                        onClick: header?.column?.getToggleSortingHandler()
                      }}>
                      <span>{flexRender(header?.column?.columnDef?.header, header?.getContext())}</span>
                      {header?.column?.getIsSorted() ? (
                        <span className="ml-1 text-xs">
                          {{
                            asc: '▲',
                            desc: '▼'
                          }[header?.column?.getIsSorted() as string] ?? null}
                        </span>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}

        <tbody className="bg-white divide-y divide-gray-200 ">
          {table?.getRowModel()?.rows?.map((row) => (
            <tr key={row?.id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
              {row?.getVisibleCells().map((cell) => (
                <td
                  key={cell?.id}
                  className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200 whitespace-nowrap">
                  {flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isNoData && (
        <div className="w-full bg-gray-50 rounded-lg p-4  text-gray-500  flex items-center justify-center text-center ">
          {noDataMessage}
        </div>
      )}
    </div>
  );
}
