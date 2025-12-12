import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ROUTES, CONTACT_EMAIL } from '../utils/constants';
import goldenKeychain from '../cart/golden_keychain.png';
import silverKeychain from '../cart/silver_keychain.png';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, updateKeychain, clearCart, getTotalPrice, MAX_QUANTITY } = useCart();
  const totalPrice = getTotalPrice();
  const TRANSPORT_FEE = 17;
  const finalTotal = totalPrice + TRANSPORT_FEE;
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const hasKeychainTag = (item) => {
    if (!item.tags || !Array.isArray(item.tags)) return false;
    return item.tags.some(tag => 
      tag.toLowerCase() === 'keychains' || 
      tag.toLowerCase() === 'bag charms'
    );
  };

  const generateOrderEmail = () => {
    const subjectText = name 
      ? `Comandă nouă de la ${name}`
      : 'Comandă nouă - Croșetele Irinei';
    const subject = encodeURIComponent(subjectText);
    
    let body = 'Bună ziua!\n\n';
    body += 'Aș dori să comand următoarele produse:\n\n';
    
    cartItems.forEach((item, index) => {
      body += `${index + 1}. ${item.name}\n`;
      body += `Cantitate: ${item.quantity}\n`;
      if (item.keychain) {
        const keychainName = item.keychain === 'silver' ? 'argintiu' : 'auriu';
        body += `Breloc: ${keychainName}\n`;
      }
      body += '\n';
    });
    
    if (comment.trim()) {
      body += `Comentariu:`;
      body += '\n';
      body += `${comment}\n\n`;
    }
    
    body += 'Vă mulțumesc!\n';
    
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="cart-empty-state">
            <h1 className="cart-title">Coș de cumpărături</h1>
            <p className="cart-empty">Coșul tău este gol.</p>
            <a href={ROUTES.products} className="landing-btn landing-btn-primary">
              Continuă cumpărăturile
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Coș de cumpărături</h1>
          {/* <button onClick={clearCart} className="cart-clear-btn">
            Șterge tot
          </button> */}
        </div>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name-row">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <span className="cart-item-quantity">× {item.quantity}</span>
                </div>
                {hasKeychainTag(item) && (
                  <div className="cart-item-keychain">
                    <div className="cart-keychain-options">
                      <button
                        type="button"
                        className={`cart-keychain-btn ${item.keychain === 'silver' ? 'active' : ''}`}
                        onClick={() => {
                          if (item.keychain === 'silver') {
                            updateKeychain(item.id, null);
                          } else {
                            updateKeychain(item.id, 'silver');
                          }
                        }}
                        aria-label="Select silver keychain"
                      >
                        <img src={silverKeychain} alt="Breloc argintiu" />
                      </button>
                      <button
                        type="button"
                        className={`cart-keychain-btn ${item.keychain === 'gold' ? 'active' : ''}`}
                        onClick={() => {
                          if (item.keychain === 'gold') {
                            updateKeychain(item.id, null);
                          } else {
                            updateKeychain(item.id, 'gold');
                          }
                        }}
                        aria-label="Select golden keychain"
                      >
                        <img src={goldenKeychain} alt="Breloc auriu" />
                      </button>
                      <button
                        type="button"
                        className={`cart-keychain-btn cart-keychain-btn-text ${!item.keychain ? 'active' : ''}`}
                        onClick={() => updateKeychain(item.id, null)}
                        aria-label="Without keychain"
                      >
                        Fără
                      </button>
                    </div>
                  </div>
                )}
                <div className="cart-item-total">
                  <strong>{(item.price * item.quantity).toFixed(0)} lei</strong>
                </div>
              </div>
              <div className="cart-item-controls">
                <div className="cart-item-controls-row">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      max={MAX_QUANTITY}
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 0;
                        updateQuantity(item.id, Math.min(Math.max(0, newQuantity), MAX_QUANTITY));
                      }}
                      className="quantity-input"
                      aria-label={`Quantity for ${item.name}`}
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= MAX_QUANTITY}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ×
                  </button>
                </div>
                {item.quantity >= MAX_QUANTITY && (
                  <span className="quantity-limit" aria-label="Maximum quantity reached">
                    Max {MAX_QUANTITY}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal:</span>
              <span className="cart-total-value">{totalPrice.toFixed(0)} lei</span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-label">Transport:</span>
              <span className="cart-total-value">+{TRANSPORT_FEE} lei</span>
            </div>
            <div className="cart-total-row cart-total-final">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-value">{finalTotal.toFixed(0)} lei</span>
            </div>
          </div>
          <div className="contact-form">
            <div className="form-row">
              <label htmlFor="cart-name">Nume</label>
              <input
                id="cart-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Numele tău"
              />
            </div>
            <div className="form-row">
              <label htmlFor="cart-comment">Comentariu</label>
              <textarea
                id="cart-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mesaj sau comentariu (opțional)"
                rows="5"
              />
            </div>
          </div>
          <a 
            href={generateOrderEmail()} 
            className="landing-btn landing-btn-primary cart-checkout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Finalizează comanda
          </a>
        </div>
      </div>
    </section>
  );
}

export default CartPage;

