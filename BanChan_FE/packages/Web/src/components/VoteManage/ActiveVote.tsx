import Nav from "../Nav";
import NavItem from "../NavItem";
import TempTable from "../TempTable";
import LargeButton from "../Buttons/LargeButton";
import {DataItem} from "../../Type";
import { useEffect,useState } from "react";
import { getVote } from "../../api/VoteAPI";
import { useCookies } from "react-cookie";

const header: string[] = ["id", "title", "voteDate", "voteRate"];
const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/vote/active" label="진행중인 투표" />
      <NavItem to="/vote/finish" label="완료된 투표" />
    </Nav>
  );
};

const ActiveVote = () => {

  const [votes, setVotes] = useState<DataItem[]>([]);
  const [cookies] = useCookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voteData = await getVote(cookies.Token,'api/votes/list/current');
        const fixVote = voteData.data.map((items) => {
          return {
            ...(items),
            voteDate: `${items.startDate
              .replace("T", " ")} ~ ${items.endDate.replace("T", " ")}`,
            voteRate: ((items.finishCount / items.voteCount) * 100).toFixed(1) + '%'
            };
          });
          setVotes(fixVote);
        }
      catch (error) {
        alert('데이터를 가져오는 중 오류가 발생했습니다.')
      }
      }
      fetchData();
  },[])
  
  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        <div className="flex justify-end items-center mb-6 mr-6">
          <LargeButton title="투표 생성" to="/vote/create"></LargeButton>
        </div>
        <TempTable headerProp={header} data={votes} />
      </div>
    </>
  );
};

export default ActiveVote;
