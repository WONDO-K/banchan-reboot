import React, { useState , useEffect,useRef} from "react";
import VoteForm from "./VoteForm";
import { useCookies } from "react-cookie";
import { getVoteDetail ,doVote,DeleteVote} from "../../api/VoteAPI";
import { Link,useParams,useNavigate } from "react-router-dom";
import { VoteDetailType } from "../../Type";

const VoteDetail: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cookies] = useCookies()
  const [votes, setVotes] = useState<{ [key: number]: number }>({});
  const [voteData,setvoteData] = useState<VoteDetailType|null>()
  // axios요청으로 voteData 안에 데이터 담아야함
  const { id } = useParams();
  const [scrollPosition, setScrollPosition] = useState(0);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Data = await getVoteDetail(cookies.Token,`api/votes/detail/${id}`);
        setvoteData(Data)
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
      navigate('/vote/active')
    })
  }
  const handleVoteChange = (question_id: number, option_id: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      setScrollPosition(scrollContainer.scrollTop);
      setVotes((prevVotes) => ({
        ...prevVotes,
        [question_id]: option_id,
      }));
    }
  };
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!voteData){
      alert('투표 데이터를 읽을 수 없습니다.')
      return
    }

    if (Object.keys(votes).length === voteData.questions.length) {
      const voteResult = Object.keys(votes).map((question_id) => ({
        questionId: Number(question_id),
        optionId: votes[Number(question_id)],
      }));
      const Data = {
        voteId: voteData.id,
        responses: voteResult,
      };


      const voting = async () => {
        try {
          await doVote(cookies.Token,'api/votes/vote',Data);
          }
        catch (error) {
          alert('데이터를 가져오는 중 오류가 발생했습니다.')
        }
        }
        voting().then(() => {
          navigate('/vote/active')
        }).catch(() => {
          alert('투표가 정상적으로 진행되지 않았습니다.')
        })

      // 이 밑에 axios 요청이 들어감
    } else {
      alert("모든 항목에 투표를 해 주세요");
    }
  };

  const Contents = () => {

    return (
      // 백엔드로 POST 요청 보내는 로직 필요
      // 투표 가져오는 로직, submit 했을 시 투표 결과 보내는 로직 및 투표 틀 만들기 필요
      voteData ? (

        
        <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">제목</h2>
          <p className="w-full h-14   bg-customBackgroundColor text-base p-3 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform">
            {voteData.title}
          </p>
        </div>
        {/* 내용 */}
        <div>
          <h2 className="text-base m-2 text-customTextColor">내용</h2>
          {/* 본문 */}
          <div 
          ref={scrollContainerRef}
          className="w-full h-[350px] overflow-y-auto bg-customBackgroundColor resize-none text-base px-4 py-2 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform"
          >
            <p className=" whitespace-pre-wrap">{voteData.content}</p>

            {voteData.questions.map((question) => (
              <VoteForm
              key={question.questionId}
              question={question}
              voteSelection={handleVoteChange}
              selectedOption={
                Object.hasOwnProperty.call(votes, question.questionId)
                ? votes[question.questionId]
                : null
              }
              />
            ))}
          </div>
        </div>
        {/* 투표 기간 */}
        <div className="flex justify-end pt-2">
          <span className="text-sm font-semibold mx-4">
            투표 기간 : {voteData.startDate.replace("T", " ")} ~{" "}
            {voteData.endDate.replace("T", " ")}
          </span>
        </div>
        {/* 투표 버튼 */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            className=" w-32 h-10 mx-3 bg-customBlue text-white p-2 rounded-full"
            onClick={handleDeleteVote}
            >
            투표 삭제
          </button>
          <Link to="/message">
            <button
              type="button"
              className=" w-32 h-10 mx-3 bg-customBlue text-white p-2 rounded-full"
              >
              투표 알람 전송
            </button>
          </Link>

          <button
            type="submit"
            className=" w-32 h-10 mx-3 bg-customBlue text-white p-2 rounded-full"
            >
            투표 제출
          </button>
        </div>
      </form>
      ) : (
      <div>
        로딩중
      </div>
      )
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

export default VoteDetail;
