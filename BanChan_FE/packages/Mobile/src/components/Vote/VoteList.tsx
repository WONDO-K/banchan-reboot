import React,{useEffect,useState} from "react";
import NewDrawer from "./newDrawer";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { getVote } from "../../mobileapi/VoteAPI";
import { useCookies } from "react-cookie";
const VoteList: React.FC = () => {
  const navigate = useNavigate();
  const [cookies]  = useCookies();
  const [ongoingItems,setOngoingVote] = useState([
    {
      id : 1,
      title: "LH 7월 3주차 투표",
      date: "07.15 19:00 ~ 07.21 18:00",
      voteRate: 38,
      voted : false,
    },
    { id : 2,
      title: "LH 7월 3주차 투표",
      date: "07.15 19:00 ~ 07.21 18:00",
      voteRate: 38,
      voted : false,
    },
  ])

  const [completedItems,setCompleteVote] = useState([
    {
      id : 1,
      title: "LH 6월 3주차 투표",
      date: "06.15 19:00 ~ 06.21 18:00",
      voteRate: 75,
      voted : false,

    },
    { id : 2,
      title: "LH 5월 3주차 투표",
      date: "05.15 19:00 ~ 05.21 18:00",
      voteRate: 60,
      voted : false,
    },
  ])

  useEffect(() => {
    const getData = async () => {
      const nowVote = await getVote(cookies.Token,'api/votes/list/current');
      const crt_data = nowVote.data.map((item) => ({
        id: item.id,
        title: item.title,
        voteRate: parseFloat(((item.finishCount / item.voteCount) * 100).toFixed(1)),
        date: `${item.startDate} ~ ${item.endDate}`,
        voted: item.voted
      }));
      setOngoingVote(crt_data);

      const endVote = await getVote(cookies.Token,'api/votes/list/finished');
      const end_data = endVote.data.map((item) => ({
        id: item.id,
        title: item.title,
        voteRate: parseFloat(((item.finishCount / item.voteCount) * 100).toFixed(1)),
        date: `${item.startDate} ~ ${item.endDate}`,
        voted: item.voted
      }));
      setCompleteVote(end_data);
      
    };
    getData();
  }, [cookies.Token]);
  const handleVoteClick = (id: number) => {
    navigate(`/m/vote/showvote/${id}`);
  };

  const handleResultClick = (id: number) => {
    navigate(`/m/vote/voteResult/${id}`);
  };
  return (
    <div className="min-h-screen ">
      {/* 상단 네비게이션 */}
      <Header>나의 투표</Header>
      {/* 진행 중인 투표 */}
      <NewDrawer
        title="진행중인 투표"
        items={ongoingItems.map((item) => ({
          ...item,
          onClick: () => handleVoteClick(item.id),
        }))}
      />
      {/* 완료된 투표 */}
      <NewDrawer
        title="완료된 투표"
        items={completedItems.map((item) => ({
          ...item,
          onClick: () => handleResultClick(item.id),
        }))}
      />{" "}
    </div>
  );
};

export default VoteList;
