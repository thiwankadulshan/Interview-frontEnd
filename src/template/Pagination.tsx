import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: string;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  color = '#6366f1',
  className = '',
}) => {
  const getPages = () => {
    const pages = [];
    const maxVisible = 2;
    
    for (let i = Math.max(1, currentPage - maxVisible); i <= Math.min(totalPages, currentPage + maxVisible); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-2 py-6 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            backgroundColor: currentPage === page ? color : 'transparent',
          }}
          className={`
            w-10 h-10 rounded-lg text-sm transition-all
            ${currentPage === page ? 'text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
