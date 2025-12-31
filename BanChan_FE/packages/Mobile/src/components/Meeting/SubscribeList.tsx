import { Subscriber } from "openvidu-browser";
import React, { useState } from "react";

interface SubscriberListProps {
  subscribers: Subscriber[];
}

const SubscriberList: React.FC<SubscriberListProps> = ({ subscribers }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const subscribersPerPage = 2; // 한 페이지에 표시할 구독자 수

  const totalPages = Math.ceil(subscribers.length / subscribersPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages - 1 ? prevPage + 1 : prevPage
    );
  };

  const startIndex = currentPage * subscribersPerPage;
  const currentSubscribers = subscribers.slice(
    startIndex,
    startIndex + subscribersPerPage
  );

  return (
    <div className="flex items-center justify-center relative">
      {/* 이전 페이지 버튼 */}
      {subscribers.length > subscribersPerPage && currentPage > 0 && (
        <button
          onClick={handlePreviousPage}
          className="absolute left-[-25px] bg-gray-500 text-white p-2 rounded-full"
        >
          {"<"}
        </button>
      )}

      <div className="flex flex-wrap justify-center rounded-xl">
        {currentSubscribers.map((sub, index) => (
          <video
            key={index}
            ref={(el) => {
              if (el) sub.addVideoElement(el);
            }}
            autoPlay
            playsInline
            className="w-[120px] h-[120px] object-cover bg-black mx-2 my-4 rounded-[12px]"
          ></video>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      {subscribers.length > subscribersPerPage &&
        currentPage < totalPages - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-[-25px] bg-gray-500 text-white p-2 rounded-full"
          >
            {">"}
          </button>
        )}
    </div>
  );
};

export default SubscriberList;
