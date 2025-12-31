import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../App.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const CalendarApp: React.FC = () => {
  // const [value, setValue] = useState(new Date());

  return (
    <div>
      <h2 className="mt-4 text-[20px] calendarHeader">날짜를 선택해주세요.</h2>

      <div className="flex flex-col items-center justify-center">
        <Calendar
          locale="ko-KR" // 문자열로 로케일을 전달
          // onChange={onChange}
          // value={value}
          next2Label={null}
          prev2Label={null}
          formatDay={(_, date) => format(date, "d", { locale: ko })} // date-fns의 locale 객체를 사용
          // tileContent={addContent}
          showNeighboringMonth={false}
        />
      </div>
    </div>
  );
};

export default CalendarApp;
