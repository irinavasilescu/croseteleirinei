import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import { findItemById } from './utils/helpers';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ItemModal from './components/ItemModal';
import HomePage from './pages/HomePage';
import PlushiesPage from './pages/PlushiesPage';
import WearablesPage from './pages/WearablesPage';
import HomewarePage from './pages/HomewarePage';
import ProductsPage from './pages/ProductsPage';
import DollPage from './pages/DollPage';
import CartPage from './pages/CartPage';
import FlowersPage from './pages/FlowersPage';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);

  // Track if we're initializing from query params to avoid loops
  const isInitializingRef = useRef(true);

  // Initialize selectedItem from query params on mount
  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = findItemById(itemId);
      if (item) {
        isInitializingRef.current = true;
        setSelectedItem(item);
      } else {
        // If item not found, remove invalid query param
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('item');
          return newParams;
        });
      }
    }
    // Mark initialization as complete after a brief delay
    const timer = setTimeout(() => {
      isInitializingRef.current = false;
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update query params when selectedItem changes (but not during initialization)
  useEffect(() => {
    if (isInitializingRef.current) {
      return; // Skip during initialization
    }
    
    if (selectedItem) {
      const currentItemId = searchParams.get('item');
      // Only update if different to avoid unnecessary updates
      if (currentItemId !== selectedItem.id) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('item', selectedItem.id);
          return newParams;
        });
      }
    } else {
      // Only remove if it exists
      if (searchParams.get('item')) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('item');
          return newParams;
        });
      }
    }
  }, [selectedItem, searchParams, setSearchParams]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedItem]);


  return (
    <CartProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path={ROUTES.home} element={<HomePage onItemClick={setSelectedItem} />} />
          <Route path={ROUTES.plushies} element={<PlushiesPage onItemClick={setSelectedItem} />} />
          <Route path={ROUTES.homeware} element={<HomewarePage onItemClick={setSelectedItem} />} />
          <Route path={ROUTES.wearables} element={<WearablesPage onItemClick={setSelectedItem} />} />
          <Route path={ROUTES.products} element={<ProductsPage/>} />
          <Route path={ROUTES.dolls} element={<DollPage />} />
          <Route path={ROUTES.flowers} element={<FlowersPage onItemClick={setSelectedItem} />} />
          <Route path={ROUTES.cart} element={<CartPage />} />
          <Route path="*" element={<HomePage onItemClick={setSelectedItem} />} />
        </Routes>
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </CartProvider>
  );
}

export default App;
