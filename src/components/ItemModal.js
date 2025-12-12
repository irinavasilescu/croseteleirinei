import { useState, useEffect } from 'react';
import { ROUTES } from '../utils/constants';
import { useCart } from '../context/CartContext';

function ItemModal({ item, onClose }) {
  const { setItemQuantity, cartItems, MAX_QUANTITY } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);
  
  const cartItem = item ? cartItems.find(cartItem => cartItem.id === item.id) : null;
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  
  // Initialize local quantity from cart when modal opens, or default to 1
  useEffect(() => {
    if (item) {
      setLocalQuantity(cartQuantity > 0 ? cartQuantity : 1);
    }
  }, [cartQuantity, item]);
  
  if (!item) return null;

  const canAddMore = localQuantity < MAX_QUANTITY;
  const isInStock = typeof item.in_stock === 'boolean' ? item.in_stock : true;
  
  const handleAddToCart = () => {
    setItemQuantity(item, localQuantity);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTagClassName = (tag) => {
    const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
    return `modal-tag modal-tag-${normalizedTag}`;
  };

  const getTagDisplayName = (tag) => {
    switch (tag) {
      case 'toys':
        return 'Jucării';
      case 'bag charms':
        return 'Accesorii pentru geantă';
      case 'keychains':
        return 'Brelocuri';
      default:
        return tag;
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <div className="modal-body">
          <div className="modal-image">
            {item.is_new &&(
              <span className="badge-new" aria-label="Produs nou">Nou</span>
            )}
            <img src={item.img} alt={item.name} />
          </div>
          <div className="modal-info">
            <h2 className="modal-title">{item.name}</h2>
            {item.price && (
              <div className="modal-price">
                <span className="modal-price-value">{item.price} lei</span>
              </div>
            )}
            {typeof item.in_stock === 'boolean' && (
              <div className="modal-stock">
                <span className={`modal-stock-badge ${item.in_stock ? 'is-in-stock' : 'is-out-of-stock'}`}>
                  <span className="modal-stock-dot" aria-hidden="true" />
                  <span className="modal-stock-text">{item.in_stock ? 'În stoc' : 'Pe comandă'}</span>
                </span>
              </div>
            )}
            {item.description && (
              <div className="modal-description">
                <p>{item.description}</p>
              </div>
            )}
            {item.dimensions && (
              <div className="modal-dimensions">
                <p className="modal-dimensions-value">{item.dimensions}</p>
              </div>
            )}
             {item.tags?.length && (
               <div className="modal-tags">
                 {item.tags.map(tag => (
                   <span key={tag} className={getTagClassName(tag)}>
                     <span className="modal-tag-text">#{getTagDisplayName(tag)}</span>
                   </span>
                 ))}
               </div>
               )}
            <div className="modal-actions">
              <div className="modal-quantity-container">
                <div className="modal-quantity-row">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (localQuantity > 0) {
                          setLocalQuantity(localQuantity - 1);
                        }
                      }}
                      disabled={localQuantity === 0}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      id="modal-quantity"
                      type="number"
                      min="0"
                      max={MAX_QUANTITY}
                      value={localQuantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (isNaN(newQuantity) || newQuantity < 0) {
                          setLocalQuantity(1);
                        } else {
                          setLocalQuantity(Math.min(Math.max(0, newQuantity), MAX_QUANTITY));
                        }
                      }}
                      className="quantity-input"
                      aria-label={`Quantity for ${item.name}`}
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (localQuantity < MAX_QUANTITY) {
                          setLocalQuantity(localQuantity + 1);
                        }
                      }}
                      disabled={!canAddMore}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={localQuantity === 0}
                    className="landing-btn landing-btn-primary modal-cta"
                    aria-label={`Add ${localQuantity} ${item.name} to cart`}
                  >
                    Adaugă în coș
                  </button>
                </div>
                <div className="modal-quantity-hints">
                  <div className="modal-quantity-hint-left">
                    {localQuantity >= MAX_QUANTITY && (
                      <span className="quantity-limit" aria-label="Maximum quantity reached">
                        Max {MAX_QUANTITY}
                      </span>
                    )}
                  </div>
                  <div className="modal-quantity-hint-right">
                    <span className="modal-quantity-total" style={{ visibility: localQuantity > 0 ? 'visible' : 'hidden' }}>
                      {localQuantity > 0 ? (
                        <>Total: <strong>{(item.price * localQuantity).toFixed(0)} lei</strong></>
                      ) : (
                        <>Total: <strong>0 lei</strong></>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

