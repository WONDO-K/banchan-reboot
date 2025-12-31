import React from "react";
import TempTableRow from "./TempTableRow";
import { DataItem } from "../Type";

export interface TableProps {
  headerProp: string[];
  data: DataItem[];
}

const HeaderFormet: { [key: string]: string } = {
  id: "번호",
  title: "제목",
  writer: "작성자",
  voteDate: "투표 기간",
  createdAt: "작성 시각",
  voteRate: "투표율",
  views: "조회수",
  likes: "추천수",
  voted: "투표 여부",
};

const TempTable: React.FC<TableProps> = ({ headerProp, data }) => {
  const headers = headerProp.map((key) => HeaderFormet[key]);

  return (
    <div className="min-w-full bg-white table-fixed rounded-[20px] overflow-hidden">
      <table className="min-w-full bg-white">
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
          {data.length
            ? data.map((row, rowIndex) => (
                <TempTableRow key={rowIndex} row={row} columns={headerProp} />
              ))
            : null}
        </tbody>
      </table>
      {/* 데이터가 없을 때 중앙에 메시지를 표시하기 위해 추가된 코드 */}
      {!data.length && (
        <div className="flex justify-center items-center h-96">
          <p>데이터가 존재하지 않습니다. 새로 생성하시거나 새로고침 해주세요</p>
        </div>
      )}
    </div>
  );
};

export default TempTable;
