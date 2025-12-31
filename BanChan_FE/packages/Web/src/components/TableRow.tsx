import React from "react";
import { TableRowProps } from "../Type";

const TableRow: React.FC<TableRowProps> = ({ row }) => {
  return (
    <tr className="w-full border-b">
      {row.map((cell, index) => (
        <td key={index} className="p-4 text-center">
          {cell}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
