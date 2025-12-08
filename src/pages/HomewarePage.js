import { useState } from 'react';
import { homeware } from '../homeware';
import Pagination from '../components/Pagination';
import ItemCard from '../components/ItemCard';
import { ITEMS_PER_PAGE } from '../utils/constants';

function HomewarePage({ onItemClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(homeware.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = homeware.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="section">
      <div className="container">
        {homeware.length === 0 ? (
          <p>No homeware found.</p>
        ) : (
          <div className="animals-grid">
            {currentItems.map((item, idx) => (
              <ItemCard key={idx} item={item} onClick={() => onItemClick(item)} />
            ))}
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </section>
  );
}

export default HomewarePage;

