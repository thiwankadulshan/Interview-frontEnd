import React from 'react';

interface Column {
  header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  rows: any[];
  bgColor?: string;
  headerColor?: string;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  bgColor = '#1e293b',
  headerColor = '#334155',
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center w-full py-8 ${className}`}>
      <div className="overflow-hidden shadow-2xl rounded-xl w-full max-w-7xl">
        <table className="min-w-full divide-y divide-slate-700">
          <thead style={{ backgroundColor: headerColor }}>
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: bgColor }} className="divide-y divide-slate-700">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-800 transition-colors">
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-300"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
