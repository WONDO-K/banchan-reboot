import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import { getVoteDetail } from "../../mobileapi/VoteAPI";
import { useCookies } from "react-cookie";
const FinishedVote: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cookies] = useCookies();
  const [voteRate, setVoteRate] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const voteData = await getVoteDetail(
        cookies.Token,
        `api/votes/detail/${id}`
      );
      if (voteData) {
        setVoteRate(
          parseFloat(
            ((((voteData.finishCount)+1) / voteData.voteCount) * 100).toFixed(1)
          )
        );
      }
    };
    getData();
    console.log("voteRate:", voteRate);
  }, [cookies.Token]);

  const goToVoteList = () => {
    navigate("/m/vote/voteList");
  };

  const goToHome = () => {
    navigate("/m/home");
  };

  const CustomGauge = () => (
    <div>
      <GaugeChart
        id="gauge-chart3"
        nrOfLevels={2}
        arcsLength={[voteRate / 100, 1 - voteRate / 100]} // 전체 아크를 하나로 설정
        colors={["#0057ff", "#e9e9e9"]} // 첫 번째 색상은 게이지가 채워지는 부분, 두 번째 색상은 남은 부분
        percent={voteRate / 100} // 게이지가 38% 채워짐
        arcWidth={0.2} // 아크의 두께를 0.2로 설정
        textColor="#0057ff" // 텍스트 색상을 파란색으로 설정
        needleColor="#0057ff" // 바늘 색상을 파란색으로 설정
        needleBaseColor="#e9e9e9" // 바늘 중심부 색상을 회색으로 설정
        // formatTextValue={(value) => `${38} %`} // 텍스트 값을 퍼센트로 포맷팅 // value값은 바꿀거임 !!
        formatTextValue={() => `${voteRate} %`}
      />
    </div>
  );
  return (
    <div className="min-h-screen">
      <Header>투표</Header>

      <div className="flex items-center justify-center flex-col mt-[90px]">
        <div className="mb-[30px] text-[28px] font-bold text-blue-600">
          투표 완료
        </div>
        <div className="mb-[50px] text-[25px] font-bold">
          소중한 한 표 감사합니다.
        </div>
        <CustomGauge />
        <div className="mt-[20px] text-[20px] font-bold">
          LH 7월 3주차 실시간 투표율
        </div>

        <div className="flex mt-[100px]">
          <button
            onClick={() => goToVoteList()}
            className=" w-[120px] h-[53px] border rounded-xl bg-gray-200 mr-4 text-[14px] text-blue-600 font-bold"
          >
            투표 목록
            <br />
            바로가기
          </button>
          <button
            onClick={() => goToHome()}
            className="w-[120px] h-[53px] border rounded-xl bg-gray-200 text-[14px] text-blue-600 font-bold"
          >
            메인 페이지
            <br />
            바로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishedVote;
