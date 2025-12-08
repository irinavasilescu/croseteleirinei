function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-button${p === currentPage ? ' is-active' : ''}`}
          onClick={() => goTo(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          aria-label={`Page ${p}`}
        >
          {p}
        </button>
      ))}
      <button
        className="pagination-button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
}

export default Pagination;

