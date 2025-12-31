import React, { useState,useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import { SwipeableContentProps } from "../../Types";
import { useParams } from "react-router-dom";
import { doVote } from "../../mobileapi/VoteAPI";
import { useCookies } from "react-cookie";
const SwipeableContent: React.FC<SwipeableContentProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const {id} = useParams()
  const [cookies] = useCookies()
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) =>
        Math.min(prev + 2, Math.floor((items.length - 1) / 2) * 2)
      ),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 2, 0)),
    trackMouse: true,
  });

  const handleOptionClick = (index: number, optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleFinishVoteClick = () => {
    if (selectedOptions.includes(-1)) {
      alert('모든 투표를 진행해주세요')
    } else{
      const data = items.map((item,index) => {
        if (selectedOptions[index] !=0){
          return {
            questionId : Number(item.questionId),
            optionId : Number(item.options[selectedOptions[index]].id),
              }
            }
            
          }
        )
        if (data) {
      const answer = { 
        voteId : Number(id) as unknown as number,
        responses : data.filter((response): response is { questionId: number; optionId: number; } => response !== undefined)}

      doVote(cookies.Token,`api/votes/vote`,answer)
    }
    navigate(`/m/vote/finishedVote/${id}`);
    }
  };

  useEffect(() => {
    setSelectedOptions(Array(items.length).fill(-1))
  }, [items]);
  return (
    <div
      {...handlers}
      className="relative w-full h-[550px] mt-4 overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${(currentIndex / 2) * 100}%)`,
          width: `${(items.length / 2) * 100}%`,
        }}
      >
        {items.map((item, index) =>
          index % 2 === 0 ? (
            <div
              key={index}
              className="flex flex-col w-[300px] flex-none"
              style={{ width: "100%" }}
            >
              <div className="w-[300px] p-4 border border-black rounded-2xl bg-white m-4">
                <h4 className="text-lg font-bold">{item.questionText}</h4>
                <div className="mt-4">
                  {item.options.map((option, optionIdx) => (
                    <p
                      key={optionIdx}
                      className={`text-gray-800 cursor-pointer p-2 rounded-md ${
                        selectedOptions[index] === optionIdx
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleOptionClick(index, optionIdx)}
                    >
                      {option.optionText}
                    </p>
                  ))}
                </div>
              </div>
              {items[index + 1] && (
                <div className="w-[300px] p-4 border border-black rounded-2xl bg-white m-4">
                  <h4 className="text-lg font-bold">
                    {items[index + 1].questionText}
                  </h4>
                  <div className="mt-4">
                    {items[index + 1].options.map((option, optionIdx) => (
                      <p
                        key={optionIdx}
                        className={`text-gray-800 cursor-pointer p-2 rounded-md ${
                          selectedOptions[index + 1] === optionIdx
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                        onClick={() => handleOptionClick(index + 1, optionIdx)}
                      >
                        {option.optionText}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {currentIndex === index && currentIndex >= items.length - 2 && (
                <div className="flex ml-[130px] min-w-[100px]">
                  <button
                    onClick={handleFinishVoteClick}
                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-full  hover:bg-green-600"
                  >
                    투표 완료
                  </button>
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default SwipeableContent;
