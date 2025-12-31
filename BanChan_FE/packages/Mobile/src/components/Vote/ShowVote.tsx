import React from "react";
import SwipeableContent from "./SwipeableContent";
import Header from "../Header";
import { useState,useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { getVoteDetail } from "../../mobileapi/VoteAPI";
const ShowVote: React.FC = () => {
  const [cookies] = useCookies()
  const {id} = useParams()
  const [title,setTitle] = useState<string>('제목')
  const [voteItems,setVoteItems] = useState([
    {
      questionId:1,
      questionText: "이번 회계 감사 받기를 동의하십니까?",
      options: [{id : 1, optionText: "1. 예"}, {id : 2, optionText: "2. 아니오"}],
    },
    {
      questionId:2,
      questionText: "올해 예산안을 승인하십니까?",
      options: [{id : 3, optionText: "1. 예"}, {id : 4, optionText: "2. 아니오"}],
    }
  ])

  useEffect(() => {
    const getData = async () => {
      const nowVote = await getVoteDetail(cookies.Token,`api/votes/detail/${id}`);
      setTitle(nowVote?.title as string);
      const crt_data = nowVote?.questions
      if(crt_data) (
        setVoteItems(crt_data)
      ) 
    };
    getData();
  }, [cookies.Token]);

  return (
    <div className="min-h-screen w-[360px]">
      <Header>투표</Header>
      <div className="p-4">
        <h3 className="text-[20px] font-bold mb-4 flex justify-center mt-10">
          {title}
        </h3>
        <SwipeableContent items={voteItems}/>
      </div>
    </div>
  );
};

export default ShowVote;
