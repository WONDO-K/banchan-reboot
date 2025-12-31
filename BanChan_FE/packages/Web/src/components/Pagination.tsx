import React, { useState } from "react";
import { PageProps } from "../Type";

const Page: React.FC<PageProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);

    let startPage = Math.max(currentPage - halfMaxPageNumbers, 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    if (endPage - startPage < maxPageNumbers - 1) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-4 py-2 rounded ${
            i === currentPage
              ? "bg-indigo-500 text-white"
              : "bg-white text-gray-700"
          } border ${
            i === currentPage ? "border-indigo-500" : "border-gray-300"
          } ${hoveredPage === i ? "transform scale-110" : ""}`}
          onClick={() => handlePageClick(i)}
          onMouseEnter={() => setHoveredPage(i)}
          onMouseLeave={() => setHoveredPage(null)}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <button
              className="px-4 py-2 mx-1 rounded bg-white text-gray-700 border border-gray-300"
              onClick={() => handlePageClick(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              className="px-4 py-2 mx-1 rounded bg-white text-gray-700 border border-gray-300"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        className="px-4 py-2 mx-1 rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        className="px-4 py-2 mx-1 rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

interface PaginationProps {
  maxPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ maxPage ,  currentPage, onPageChange }) => {
  const totalItems = maxPage * 10;
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="container mx-auto p-4">
      <Page
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Pagination;
