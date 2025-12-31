import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

interface OptionResult {
  optionId: number;
  optionText: string;
  voteCount: number;
  percentage?: number;
}

interface QuestionResult {
  questionId: number;
  questionText: string;
  optionResults: OptionResult[];
}

interface SwipeableResultProps {
  items: QuestionResult[];
}

const SwipeableResults: React.FC<SwipeableResultProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) =>
        Math.min(prev + 2, Math.floor((items.length - 1) / 2) * 2)
      ),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 2, 0)),
    trackMouse: true,
  });

  const goToVoteList = () => {
    navigate("/m/vote/voteList");
  };

  const calculatePercentages = (options: OptionResult[] | undefined) => {
    if (!options || options.length === 0) {
      return [];
    }
    const total = options.reduce((sum, option) => sum + option.voteCount, 0);
    return options.map(option => ({
      ...option,
      percentage: total > 0 ? Math.round((option.voteCount / total) * 100) : 0
    }));
  };

  const getMaxPercentageOptions = (options: OptionResult[]) => {
    if (options.length === 0) return [];
    const maxPercentage = Math.max(...options.map(o => o.percentage || 0));
    return options.filter(o => o.percentage === maxPercentage);
  };

  if (!items || items.length === 0) {
    return <div>투표 결과가 없습니다.</div>;
  }

  return (
    <div
      {...handlers}
      className="relative w-full h-[600px] mt-4 overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${(currentIndex / 2) * 100}%)`,
          width: `${Math.ceil(items.length / 2) * 100}%`,
        }}
      >
        {items.map((item, index) => {
          const optionsWithPercentages = calculatePercentages(item.optionResults);
          const maxPercentageOptions = getMaxPercentageOptions(optionsWithPercentages);

          return index % 2 === 0 ? (
            <div
              key={index}
              className="flex flex-col w-[300px] flex-none"
              style={{ width: "100%" }}
            >
              <div className="w-[300px] p-4 border border-black rounded-2xl bg-white m-4">
                <h4 className="text-lg font-bold">{item.questionText}</h4>
                <div className="mt-4">
                  {optionsWithPercentages.map((option, optionIdx) => (
                    <p
                      key={optionIdx}
                      className={`text-gray-800 p-2 rounded-md ${
                        maxPercentageOptions.some(o => o.optionId === option.optionId) ? "bg-yellow-300" : "bg-white"
                      }`}
                    >
                      {option.optionText} - {option.percentage}% ({option.voteCount} votes)
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
                    {(() => {
                      const nextOptionsWithPercentages = calculatePercentages(items[index + 1].optionResults);
                      const nextMaxPercentageOptions = getMaxPercentageOptions(nextOptionsWithPercentages);
                      return nextOptionsWithPercentages.map((option, optionIdx) => (
                        <p
                          key={optionIdx}
                          className={`text-gray-800 p-2 rounded-md ${
                            nextMaxPercentageOptions.some(o => o.optionId === option.optionId) ? "bg-yellow-300" : "bg-white"
                          }`}
                        >
                          {option.optionText} - {option.percentage}% ({option.voteCount} votes)
                        </p>
                      ));
                    })()}
                  </div>
                </div>
              )}
              {currentIndex === index && currentIndex >= items.length - 2 && (
                <div className="flex ml-[130px] ">
                  <button
                    onClick={goToVoteList}
                    className="py-2 px-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600"
                  >
                    투표 목록
                  </button>
                </div>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default SwipeableResults;