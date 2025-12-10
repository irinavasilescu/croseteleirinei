import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../utils/constants';
import cartIcon from '../nav/cart.webp';

function CartIcon() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <NavLink
      to={ROUTES.cart}
      className="nav-item-icon cart-icon"
      title="Cart"
      aria-label={`Cart (${totalItems} items)`}
    >
      <span className="cart-icon-wrapper">
        <img src={cartIcon} alt="Cart" className="cart-icon-image" />
        {totalItems > 0 && (
          <span className="cart-badge" aria-label={`${totalItems} items in cart`}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </span>
    </NavLink>
  );
}

export default CartIcon;

