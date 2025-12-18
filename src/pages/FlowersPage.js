import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { flowers } from '../flowers';
import Pagination from '../components/Pagination';
import ItemCard from '../components/ItemCard';
import { ITEMS_PER_PAGE } from '../utils/constants';

function FlowersPage({ onItemClick }) {
  const location = useLocation();
  const flowersList = useMemo(() => {
    return [...flowers];
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(flowersList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = flowersList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <section className="section">
      <div className="container">
        {flowersList.length === 0 ? (
          <p>No flowers found.</p>
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

export default FlowersPage;

