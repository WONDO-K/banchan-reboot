// VoteCreatePage.tsx
import React, { useState, useRef, useEffect } from "react";
import VoteCreateForm from "./VoteCreateForm";
import { Form,VoteCreateType } from "../../Type";
import { CreateVote } from "../../api/VoteAPI";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const VoteCreatePage: React.FC = () => {
  const [cookies] = useCookies();
  const [forms, setForms] = useState<Form[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [voteStart, setVoteStart] = useState("");
  const [voteEnd, setVoteEnd] = useState("");

  //   textarea 높이 자동조절 코드
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (textareaRef.current) {
      // 텍스트 길이에 따라 높이 자동 조정
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // 투표 생성
  const handleAddForm = () => {
    setForms([...forms, { id: Date.now(), questionText: "", options: [] }]);
  };
  // 투표 삭제
  const handleDeleteForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id));
  };
  // 제목 변경
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  // 내용 변경
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  // 투표 내용물 변경
  const handleFormChange = (
    id: number,
    data: { questionText: string; options: string[] }
  ) => {
    const updatedForms = forms.map((form) =>
      form.id === id ? { ...form, ...data } : form
    );
    setForms(updatedForms);
  };
  // 투표 시작일 변경
  const handleVoteStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoteStart(e.target.value);
  };
  // 투표 종료일 변경
  const handleVoteEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoteEnd(e.target.value);
  };

  // 투표 등록
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data:VoteCreateType = {
      "title" : title,
      "content" : content,
      "startDate" :voteStart,
      "endDate" : voteEnd,
      "questions": forms.map((form) => ({
        "questionText": form.questionText,
        "options": form.options
      }))
        
    }
    // 서브밋 이벤트 방지
    e.preventDefault();
    // 백엔드로 POST 요청 보내는 로직 필요(axios)
    CreateVote(cookies.Token,'api/votes/regist' ,data).then(() => {

      navigate('/vote/active')
    }).catch((e) => {
      console.error(e)
    })
  };

  return (
    <div className="p-8">
      <div className="">
        <div className="flex justify-start p-5">

          <h3 className="text-3xl font-semibold">투표 생성</h3>
        </div>
        <div className="min-w-full min-h-[700px] p-6 bg-white border rounded-[20px] overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* 제목 */}
            <div>
              <h2 className="text-base m-2 text-customTextColor">제목</h2>
              <input
                name="title"
                type="text"
                className="w-full h-14 bg-customBackgroundColor text-base px-4 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform"
                placeholder="제목을 입력해 주세요"
                autoComplete="off"
                required
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            {/* 내용 */}
            <div>
              <h2 className="text-base m-2 text-customTextColor">내용</h2>
              <div className="w-full h-[350px] overflow-y-auto bg-customBackgroundColor resize-none text-base px-4 py-2 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform">
                <textarea
                  ref={textareaRef}
                  placeholder="내용을 입력해 주세요"
                  className="w-full bg-customBackgroundColor text-base row-auto resize-none overflow-hidden border-solid outline-none"
                  value={content}
                  onChange={handleContentChange}
                ></textarea>
                {/* 투표 항목 렌더링 */}
                {forms.map((form) => (
                  <VoteCreateForm
                    key={form.id}
                    id={form.id}
                    onDelete={handleDeleteForm}
                    onChange={handleFormChange}
                  />
                ))}
              </div>
            </div>
            {/* 투표버튼 및 투표 기간 */}
            <div className="flex justify-between pt-2">
              {/* 투표버튼 부분 */}
              <div>
                <button
                  name="addVote"
                  className="w-32 h-10 rounded-lg border-2 text-xs mx-4 transition-transform transform"
                  type="button"
                  onClick={handleAddForm}
                >
                  투표 추가
                </button>
              </div>
              {/* 투표 기간 부분 */}
              <div>
                <span className="text-xs mx-4">투표 기간 :</span>
                <input
                  name="voteStart"
                  className="w-52 h-10 p-2 rounded-full border-2 text-sm transition-transform transform"
                  type="date"
                  required
                  value={voteStart}
                  onChange={handleVoteStartChange}
                />
                <span className="mx-2 text-sm">~</span>
                <input
                  name="voteEnd"
                  className="w-52 h-10 p-2 rounded-full border-2 text-sm transition-transform transform"
                  type="date"
                  required
                  value={voteEnd}
                  onChange={handleVoteEndChange}
                />
              </div>
            </div>
            {/* 투표 등록 버튼 */}
            <div className="pt-2 flex justify-end">
              <button
                name="submitVote"
                type="submit"
                className="w-32 h-10 bg-customBlue text-white rounded-lg transition-transform transform hover:bg-customBlue hover:scale-105"
                id="submit"
              >
                작성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VoteCreatePage;
