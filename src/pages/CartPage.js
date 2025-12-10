import { useCart } from '../context/CartContext';
import { ROUTES } from '../utils/constants';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, MAX_QUANTITY } = useCart();
  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="cart-title">Coș de cumpărături</h1>
          <p className="cart-empty">Coșul tău este gol.</p>
          <a href={ROUTES.products} className="landing-btn landing-btn-primary">
            Continuă cumpărăturile
          </a>
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
            <span className="cart-total-label">Total:</span>
            <span className="cart-total-value">{totalPrice.toFixed(0)} lei</span>
          </div>
          <a href={ROUTES.contact} className="landing-btn landing-btn-primary cart-checkout">
            Finalizează comanda
          </a>
        </div>
      </div>
    </section>
  );
}

export default CartPage;

