import React, { useState } from "react";
import { PollItem, VoteCreateFormProps } from "../../Type";

const VoteCreateForm: React.FC<VoteCreateFormProps> = ({
  id,
  onDelete,
  onChange,
}) => {
  // 초기 항목 2개 설정
  const initialItems: PollItem[] = [
    { id: Date.now(), text: "" },
    { id: Date.now() + 1, text: "" },
  ];
  const [title, setTitle] = useState<string>("");
  const [items, setItems] = useState<PollItem[]>(initialItems);

  const notifyChange = (newTitle: string, newItems: PollItem[]) => {
    onChange(id, {
      questionText: newTitle,
      options: newItems.map((item) => item.text),
    });
  };

  // 항목 생성
  const handleAddItem = () => {
    const newItems = [...items, { id: Date.now(), text: "" }];
    setItems(newItems);
    notifyChange(title, newItems);
  };

  // 항목 변경
  const handleItemChange = (id: number, text: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    setItems(newItems);
    notifyChange(title, newItems);
  };

  // 항목 삭제
  const handleRemoveItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    notifyChange(title, newItems);
  };

  // 제목 변경
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    notifyChange(newTitle, items);
  };

  // 엔터 키 이벤트 삭제
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div
      className="p-4 mb-4 mx-auto text-end flex flex-col w-10/12 border rounded-3xl shadow-md"
      onKeyDown={handleKeyDown}
    >
      <div className="flex justify-between">
        <p className="m-0 pt-4 text-sm text font-semibold">투표 주제</p>
        <button
          onClick={() => onDelete(id)}
          className="self-end ml-2 p-2 text-red-500 hover:text-red-700"
        >
          X
        </button>
      </div>
      <div className="w-full flex justify-between items-center mb-2">
        <input
          id={`pollTitle-${id}`}
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="mt-1 p-2 flex-1 border border-gray-300 rounded-md"
          placeholder="투표 제목을 입력하세요"
          required
        />
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="w-10/12 flex mb-2 mx-auto items-center">
          <input
            type="text"
            value={item.text}
            onChange={(e) => handleItemChange(item.id, e.target.value)}
            className="mt-1 p-2 flex-1 border border-gray-300 rounded-md"
            placeholder="투표 항목을 입력해주세요"
            required
          />
          {index >= 2 && (
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="ml-2 p-1 text-sm text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          )}
          {index < 2 && (
            <div
              className="ml-8 p-1 text-sm"
            >
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        항목 추가
      </button>
    </div>
  );
};

export default VoteCreateForm;
