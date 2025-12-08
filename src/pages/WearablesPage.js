import { useState } from 'react';
import { wearables } from '../wearables';
import Pagination from '../components/Pagination';
import ItemCard from '../components/ItemCard';
import { ITEMS_PER_PAGE } from '../utils/constants';

function WearablesPage({ onItemClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(wearables.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = wearables.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="section">
      <div className="container">
        {wearables.length === 0 ? (
          <p>No wearables found.</p>
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

export default WearablesPage;

