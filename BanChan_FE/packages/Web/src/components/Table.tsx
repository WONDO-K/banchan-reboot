import React from "react";
import TableRow from "./TableRow";
import { TableProps } from "../Type";

const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <table className="min-w-full bg-white border table-fixed rounded-[20px] overflow-hidden">
      <thead>
        <tr className="w-full border-b text-customTextColor">
          {headers.map((header, index) => (
            <th key={index} className="p-4 text-center">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} row={row} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
