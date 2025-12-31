import React from "react";
import { VoteFormProps } from "../../Type";

const VoteEndForm: React.FC<VoteFormProps> = ({ vote }) => {
  const totalVotes = vote.optionResults.reduce(
    (sum, option) => sum + option.voteCount,
    0
  );
  const maxVoteCount = Math.max(
    ...vote.optionResults.map((option) => option.voteCount)
  );

  return (
    <div className="p-4 mb-4 mx-auto flex flex-col w-10/12 border rounded-3xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">{vote.questionText}</h2>
      {vote.optionResults.map((option) => {
        const votePercentage = (option.voteCount / totalVotes) * 100;
        const isMaxVote = option.voteCount === maxVoteCount;

        return (
          <div
            key={option.optionId}
            className="mb-2 w-full relative flex items-center"
          >
            <div className="flex-1 p-2 relative z-10 text-left">
              <span className="font-semibold">{option.optionText}</span>
            </div>
            <div className="p-2 relative z-10 text-right">
              <span className="ml-2">
                {votePercentage.toFixed(2)}% ({option.voteCount} 표)
              </span>
            </div>
            <div
              className={`absolute left-0 top-0 h-full ${
                isMaxVote ? "bg-green-200" : "bg-blue-200"
              }`}
              style={{
                width: `${votePercentage}%`,
                zIndex: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default VoteEndForm;
