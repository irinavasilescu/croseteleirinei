import './App.css';
import { useState, useMemo, useEffect } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { animals } from './animals';
import { clothes } from './clothes';
import { food } from './food';
import { accessories } from './accessories';
import { homeware } from './homeware';
import { abstract } from './abstract';

function App() {
  const CONTACT_EMAIL = 'croseteleirinei@gmail.com';

  const ROUTES = {
    animals: '/croseteleirinei/animals',
    food: '/croseteleirinei/food',
    homeware: '/croseteleirinei/homeware',
    accessories: '/croseteleirinei/accessories',
    clothes: '/croseteleirinei/clothes',
    abstract: '/croseteleirinei/abstract',
    contact: '/croseteleirinei/contact',
    home: '/croseteleirinei',
  };

  function Page({children }) {
    return (
      <section className="section">
        <div className="container">
          {children || <p>Coming soon</p>}
        </div>
      </section>
    );
  }

  // Nav icons (auto-load from src/nav)
  function loadNavIcons() {
    try {
      const ctx = require.context('./nav', false, /\.(png|jpe?g|webp|gif|svg)$/i);
      const map = {};
      ctx.keys().forEach((k) => {
        const key = k
          .replace(/^\.\//, '')
          .replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
          .toLowerCase();
        map[key] = ctx(k);
      });
      return map;
    } catch (e) {
      return {};
    }
  }

  const navIcons = loadNavIcons();

  function findIcon(name) {
    const key = name.toLowerCase();
    const exact = navIcons[key];
    if (exact) return exact;
    const fuzzy = Object.keys(navIcons).find((k) => k.includes(key));
    return fuzzy ? navIcons[fuzzy] : null;
  }

  // Helper function to create items array from images
  function createItemsArray(r) {
    try {
      return r.keys().map((key) => {
        const fileName = key.replace(/^\.\//, '').replace(/\.(png|jpe?g|webp|gif)$/i, '');
        const displayName = fileName.replace(/[_-]+/g, ' ');
        return {
          img: r(key),
          name: displayName,
          price: null,
          description: '',
        };
      });
    } catch (e) {
      return [];
    }
  }

  // Clothes, food, accessories, homeware, and abstract arrays are now imported from hardcoded files

  function AnimalsPage() {
    const location = useLocation();

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
          {animals.length === 0 ? (
            <p>No animals found.</p>
          ) : (
            <div className="animals-grid">
              {animals.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function ClothesPage() {
    return (
      <section className="section">
        <div className="container">
          {clothes.length === 0 ? (
            <p>No clothes found.</p>
          ) : (
            <div className="animals-grid">
              {clothes.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function AbstractPage() {
    return (
      <section className="section">
        <div className="container">
          {abstract.length === 0 ? (
            <p>No abstract items found.</p>
          ) : (
            <div className="animals-grid">
              {abstract.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function FoodPage() {
    return (
      <section className="section">
        <div className="container">
          {food.length === 0 ? (
            <p>No food items found.</p>
          ) : (
            <div className="animals-grid">
              {food.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function AccessoriesPage() {
    return (
      <section className="section">
        <div className="container">
          {accessories.length === 0 ? (
            <p>No accessories found.</p>
          ) : (
            <div className="animals-grid">
              {accessories.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
  // Home assets
  const homeAssets = useMemo(() => {
    try {
      const ctx = require.context('./home', false, /\.(png|jpe?g|webp|gif)$/i);
      const map = {};
      ctx.keys().forEach((k) => {
        const key = k
          .replace(/^\.\//, '')
          .replace(/\.(png|jpe?g|webp|gif)$/i, '')
          .toLowerCase();
        map[key] = ctx(k);
      });
      return map;
    } catch (e) {
      return {};
    }
  }, []);

  function HomePage() {
    const FEATURED_ANIMALS_COUNT = 15;
    const featuredAnimals = useMemo(() => {
      if (animals.length === 0) return [];
      const pool = [...animals];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, Math.min(FEATURED_ANIMALS_COUNT, pool.length));
    }, [animals]);

    return (
      <>
        <section className="landing-hero">
          <div className="landing-container">
            <div className="landing-content">
              <h1 className="landing-title">Croșetele Irinei</h1>
              <div className="landing-actions">
                <a href={ROUTES.animals} className="landing-btn landing-btn-primary">Explore</a>
                <a href={ROUTES.contact} className="landing-btn landing-btn-secondary">Contact</a>
              </div>
              <div className="landing-social">
                <div className="landing-social-item">
                  <a
                    href="https://instagram.com/crosetele_irinei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-social-link"
                    aria-label="Open Croșetele Irinei on Instagram"
                  >
                    {homeAssets.instagram ? (
                      <img src={homeAssets.instagram} alt="Instagram" />
                    ) : (
                      <span>📸</span>
                    )}
                  </a>
                  <span className="landing-social-hover-text">@crosetele_irinei</span>
                </div>
                <div className="landing-social-item">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="landing-social-link"
                  >
                    {homeAssets.mail ? (
                      <img src={homeAssets.mail} alt="Email" />
                    ) : (
                      <span>@</span>
                    )}
                  </a>
                  <span className="landing-social-hover-text">croseteleirinei@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {featuredAnimals.length > 0 && (
          <footer className="home-footer" id="gallery" aria-label="Featured animals">
            <div className="footer-animals">
              {featuredAnimals.map((item, idx) => (
                <NavLink to={`${ROUTES.animals}#${item.id}`} key={`${item.img}-${idx}`} className="footer-animal-link">
                  <figure className="footer-animal">
                    <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                  </figure>
                </NavLink>
              ))}
            </div>
          </footer>
        )}
      </>
    );
  }

  function ContactPage() {
    const CONTACT_EMAIL = 'croseteleirinei@gmail.com';
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(e) {
      e.preventDefault();
      const subject = encodeURIComponent(`New inquiry from ${name || 'Crochet site'}`);
      const body = encodeURIComponent(`${message}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      window.location.target = '_blank';
    }

    return (
      <section className="landing-hero">
        <div className="landing-container">
          <div className="landing-content">
            <h1 className="landing-title">Get in touch</h1>
            <p className="landing-subtitle">Have a custom idea or want to say hello? Drop a message and I'll get back to you soon.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your dream crochet piece..."
                  required
                />
              </div>
              <button type="submit" className="landing-btn landing-btn-primary">Send message</button>
            </form>
          </div>
        </div>
      </section>
    );
  }


  function HomewarePage() {
    return (
      <section className="section">
        <div className="container">
          {homeware.length === 0 ? (
            <p>No homeware found.</p>
          ) : (
            <div className="animals-grid">
              {homeware.map((item, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="App">
      <header className="site-header">
        <div className="container header-inner">
          <nav className="nav nav-tabs">
            {[
              { to: ROUTES.home, key: 'home', label: 'Home', end: true },
              { to: ROUTES.animals, key: 'animals', label: 'Animals' },
              { to: ROUTES.food, key: 'food', label: 'Food' },
              { to: ROUTES.homeware, key: 'homeware', label: 'Homeware' },
              { to: ROUTES.accessories, key: 'accessories', label: 'Accessories' },
              { to: ROUTES.clothes, key: 'clothes', label: 'Clothes' },
              { to: ROUTES.abstract, key: 'abstract', label: 'Abstract' },
              { to: ROUTES.contact, key: 'contact', label: 'Contact' },
            ].map((link) => {
              const icon = findIcon(link.key);
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
          </nav>
        </div>
      </header>

      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.animals} element={<AnimalsPage />} />
        <Route path={ROUTES.food} element={<FoodPage />} />
        <Route path={ROUTES.homeware} element={<HomewarePage />} />
        <Route path={ROUTES.accessories} element={<AccessoriesPage />} />
        <Route path={ROUTES.clothes} element={<ClothesPage />} />
        <Route path={ROUTES.abstract} element={<AbstractPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path="*" element={<Page title="Not found"><p>The page you are looking for does not exist.</p></Page>} />
      </Routes>
    </div>
  );
}

export default App;
