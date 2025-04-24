import React from "react";
import './DressList.css'; 

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const getPageRange = () => {
        if (totalPages <= 5) {
            return pageNumbers;
        }
        if (currentPage <= 3) {
            return pageNumbers.slice(0, 5);
        }
        if (currentPage >= totalPages - 2) {
            return pageNumbers.slice(totalPages - 5);
        }
        return pageNumbers.slice(currentPage - 3, currentPage + 2);
    };

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                {'<'}
            </button>
            {getPageRange().map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                {'>'}
            </button>
            <span className="total-pages">סך הכל {totalPages} עמודים</span>
        </div>
    );
}

export default Pagination;