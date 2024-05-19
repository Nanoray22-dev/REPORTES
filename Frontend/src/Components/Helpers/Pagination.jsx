import React from 'react';

const Pagination = ({ reportsPerPage, totalReports, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalReports / reportsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
