import { NavLink } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import plushies from '../products/plushies.webp';
import beanies from '../products/beanies.webp';
import baskets from '../products/baskets.webp';
import dolls from '../products/dolls.webp';
import flowers from '../products/flowers.png';

function ProductsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="animals-grid products-grid">
          <figure className="animal-card">
            <NavLink to={ROUTES.dolls}>
              <img src={dolls} alt='dolls' loading="lazy" />
            </NavLink>
          </figure>

          <figure className="animal-card">
            <NavLink to={ROUTES.plushies}>
              <img src={plushies} alt='plushies' loading="lazy" />
            </NavLink>
          </figure>

          <figure className="animal-card">
            <NavLink to={ROUTES.flowers}>
              <img src={flowers} alt='flowers' loading="lazy" />
            </NavLink>
          </figure>

          <figure className="animal-card">
            <NavLink to={ROUTES.wearables}>
              <img src={beanies} alt='beanies' loading="lazy" />
            </NavLink>
          </figure>

          <figure className="animal-card">
            <NavLink to={ROUTES.homeware}>
              <img src={baskets} alt='baskets' loading="lazy" />
            </NavLink>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default ProductsPage;

