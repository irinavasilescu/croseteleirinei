import { NavLink } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { loadNavIcons, findIcon } from '../utils/helpers';
import CartIcon from './CartIcon';

function Header() {
  const navIcons = loadNavIcons();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <nav className="nav nav-tabs">
          {[
            { to: ROUTES.home, key: 'home', label: 'Home', end: true },
            { to: ROUTES.dolls, key: 'dolls', label: 'Dolls' },
            { to: ROUTES.products, key: 'products', label: 'Products' },
            { to: ROUTES.contact, key: 'contact', label: 'Contact' },
          ].map((link) => {
            const icon = findIcon(link.key, navIcons);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                title={link.label}
                aria-label={link.label}
                className="nav-item-icon"
              >
                {icon ? <img className="nav-icon" src={icon} alt="" /> : link.label}
              </NavLink>
            );
          })}
          <CartIcon />
        </nav>
      </div>
    </header>
  );
}

export default Header;

