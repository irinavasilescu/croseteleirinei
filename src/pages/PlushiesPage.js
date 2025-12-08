import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animals } from '../animals';
import Pagination from '../components/Pagination';
import ItemCard from '../components/ItemCard';
import { ITEMS_PER_PAGE } from '../utils/constants';

function PlushiesPage({ onItemClick }) {
  const location = useLocation();
  const plushies = useMemo(() => {
    return [...animals];
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(plushies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = plushies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the '#'
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <section className="section">
      <div className="container">
        {plushies.length === 0 ? (
          <p>No plushies found.</p>
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

export default PlushiesPage;

