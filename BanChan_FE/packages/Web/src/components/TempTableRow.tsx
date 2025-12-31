import React from "react";
import { Link } from "react-router-dom";

interface TableRowProps {
  row: { [key: string]: string | number | React.ReactNode };
  columns: string[];
}

const TempTableRow: React.FC<TableRowProps> = ({ row, columns }) => {
  return (
    <tr className="w-full border-b">
      {columns.map((column, cellIndex) => (
        <td key={cellIndex} className="p-4 text-center">
          <Link to={`detail/${row["id"]}`}>{row[column]}</Link>
        </td>
      ))}
    </tr>
  );
};

export default TempTableRow;
