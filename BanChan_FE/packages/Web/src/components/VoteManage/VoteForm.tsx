import React from 'react';

interface Options {
  id: number;
  optionText: string;
}

interface VoteQuestionForm {
  questionId: number;
  questionText: string;
  options: Options[];
}

interface VoteFormProps {
  question: VoteQuestionForm;
  voteSelection: (questionId: number, optionId: number) => void;
  selectedOption: number | null;
}

const VoteForm: React.FC<VoteFormProps> = ({ question, voteSelection, selectedOption }) => {

  const handleOptionChange = (optionId: number,event:React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
      voteSelection(question.questionId, optionId);
  };

  return (
    <div className="p-4 mb-4 mx-auto flex flex-col w-10/12 border rounded-3xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">{question.questionText}</h2>
      {question.options.map((option) => (
        <div key={option.id} className="mb-2 w-full relative">
          <label className="flex justify-start w-full">
            <input
              type="radio"
              name={`vote-${question.questionId}`}
              value={option.id}
              onChange={(event) => handleOptionChange(option.id,event)}
              className="mr-2"
              checked={selectedOption === option.id}
            />
            <div className="flex-1 p-2 relative z-10 text-center">
              <span className="font-semibold">{option.optionText}</span>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default VoteForm;
