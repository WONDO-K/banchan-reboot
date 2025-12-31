import React,{ useEffect,useState }  from "react";
import VoteEndForm from "./VoteEndForm";
import { getVoteResult,DeleteVote } from "../../api/VoteAPI";
import { useCookies } from "react-cookie";
import { useParams,useNavigate } from "react-router-dom";
import { VoteResultType } from "../../Type";
const VoteEnd: React.FC = () => {
  const [cookies] = useCookies();
  const { id } = useParams();
  const [voteData, setVoteData] = useState<VoteResultType|null>();
  const navigate = useNavigate()
  // axios요청으로 voteData 안에 데이터 담아야함
    useEffect(() => {
    const fetchData = async () => {
      try {
        const Data = await getVoteResult(cookies.Token,`api/votes/result/${id}`);
        setVoteData(Data);
      }
      catch (error) {
        alert('데이터를 가져오는 중 오류가 발생했습니다.')
      }
      }
      fetchData();
  },[])

  const handleDeleteVote = async () => {
    await DeleteVote(cookies.Token,`api/votes/delete/${id}`).then(() => {
      alert('투표가 삭제되었습니다.');
      navigate('/vote/finish');
    })
  }

  const Contents = () => {
    return (
      // 백엔드로 POST 요청 보내는 로직 필요
      // 투표 가져오는 로직, submit 했을 시 투표 결과 보내는 로직 및 투표 틀 만들기 필요
      <>
      <form>
        {/* 제목 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">제목</h2>
          <p className="w-full h-14   bg-customBackgroundColor text-base p-3 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform">
            {voteData?.title}
          </p>
        </div>
        {/* 내용 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">내용</h2>
          {/* 본문 */}
          <div className="w-full h-[350px] overflow-y-auto bg-customBackgroundColor resize-none text-base px-4 py-2 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform">
            <p className=" whitespace-pre-wrap">{voteData?.content}</p>
            {voteData?.questionResults.map((vote) => (
              <VoteEndForm 
              key={vote.questionText}
              vote={vote} 
              />
            ))}
          </div>
        </div>
      </form>
      <div className="pt-2 flex justify-center">
      <button
        type="button"
        className=" w-32 h-10 mx-3 bg-customBlue text-white p-2 rounded-full"
        onClick={handleDeleteVote}
        >
        투표 삭제
      </button>
      </div>
      </>
    );
  };

  return (
    <div className="p-8">
      <div className="">
        <div className="flex justify-start p-5">
          <h3 className="text-3xl	font-semibold">투표 상세</h3>
        </div>
        <div className="min-w-full min-h-[700px] p-6 bg-white border rounded-[20px] overflow-hidden">
          <Contents />
        </div>
      </div>
    </div>
  );
};

export default VoteEnd;
