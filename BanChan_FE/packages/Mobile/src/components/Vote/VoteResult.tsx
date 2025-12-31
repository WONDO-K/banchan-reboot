import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Header from "../Header";
import SwipeableResults from "./SwipeableResult";
import { getVoteResult } from "../../mobileapi/VoteAPI";

interface VoteResultData {
  voteId: number;
  title: string;
  content: string;
  questionResults: {
    questionId: number;
    questionText: string;
    optionResults: {
      optionId: number;
      optionText: string;
      voteCount: number;
    }[];
  }[];
}

const VoteResult: React.FC = () => {
  const [voteData, setVoteData] = useState<VoteResultData | null>(null);
  const { id } = useParams<{ id: string }>();
  const [cookies] = useCookies(['Token']);

  useEffect(() => {
    const fetchVoteResult = async () => {
      if (id) {
        try {
          const result = await getVoteResult(cookies.Token, `api/votes/result/${id}`);
          if (result) {
            setVoteData(result as VoteResultData);
          } else {
            console.error("No data returned from getVoteResult");
          }
        } catch (error) {
          console.error("Failed to fetch vote result:", error);
        }
      }
    };
    fetchVoteResult();
  }, [id, cookies.Token]);

  if (!voteData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Header>투표 결과</Header>
      <div className="p-4">
        <h3 className="text-[20px] font-bold mb-4 flex justify-center mt-10">
          {voteData.title}
        </h3>
        <p className="text-center mb-4">{voteData.content}</p>
        <SwipeableResults items={voteData.questionResults} />
      </div>
    </div>
  );
};

export default VoteResult;