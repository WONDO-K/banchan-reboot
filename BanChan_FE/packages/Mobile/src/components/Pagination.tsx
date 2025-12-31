import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 보여줄 페이지 버튼의 최대 수

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지 수가 최대 보여줄 수 있는 페이지 수보다 작거나 같을 때
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-4 py-2 rounded-md ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // 전체 페이지 수가 많을 때
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(
          <button
            key={1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
        );

        if (startPage > 2) {
          pageNumbers.push(
            <span key="ellipsis-start" className="px-4 py-2">
              ...
            </span>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-4 py-2 rounded-md ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(
            <span key="ellipsis-end" className="px-4 py-2">
              ...
            </span>
          );
        }
        pageNumbers.push(
          <button
            key={totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;
