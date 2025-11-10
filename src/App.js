import './App.css';
import { useState, useMemo, useEffect } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { animals } from './animals';
import { wearables } from './wearables';
import { food } from './food';
import { homeware } from './homeware';
import { abstract } from './abstract';

function App() {
  const CONTACT_EMAIL = 'croseteleirinei@gmail.com';

  const ROUTES = {
    plushies: '/plushies',
    homeware: '/homeware',
    wearables: '/wearables',
    contact: '/contact',
    home: '/',
  };

  const [selectedItem, setSelectedItem] = useState(null);

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

  function ItemModal({ item, onClose }) {
    if (!item) return null;

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const getTagClassName = (tag) => {
      const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
      return `modal-tag modal-tag-${normalizedTag}`;
    };

    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
          <div className="modal-body">
            <div className="modal-image">
              <img src={item.img} alt={item.name} />
            </div>
            <div className="modal-info">
              <h2 className="modal-title">{item.name}</h2>
              {item.tags?.length && (
                <div className="modal-tags">
                  {item.tags.map(tag => (
                    <span className={getTagClassName(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.description && (
                <div className="modal-description">
                  <p>{item.description}</p>
                </div>
              )}
              {item.dimensions && (
                <div className="modal-dimensions">
                  <p>{item.dimensions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PlushiesPage() {
    const location = useLocation();
    const plushies = useMemo(() => {
      return [...animals, ...food, ...abstract];
    }, []);

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
              {plushies.map((item, idx) => (
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function WearablesPage() {
    return (
      <section className="section">
        <div className="container">
          {wearables.length === 0 ? (
            <p>No wearables found.</p>
          ) : (
            <div className="animals-grid">
              {wearables.map((item, idx) => (
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
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
          <div className="landing-banner">
            {homeAssets.banner && (
              <img src={homeAssets.banner} alt="" role="presentation" />
            )}
          </div>
          <div className="landing-container">
            <div className="landing-content">
              <p className="landing-subtitle">
                Bună! Sunt Irina, iar curiozitate mea pentru croșetat și tricotat a devenit o pasiune.
                Am împletit, am greșit, am deșirat, dar am descoperit câtă bucurie poate aduce ceva creat cu propriile mâini.
                Astăzi, fiecare lucru pe care îl croșetez este făcut cu grijă, din materiale alese local și cu multa pasiune.
                La Croșetele Irinei, fiecare creatie este transformată în bucurie, buclă cu buclă.
              </p>
              <div className="landing-actions">
                <a href={`${ROUTES.plushies}`} className="landing-btn landing-btn-primary">Vezi colecția</a>
                <a href={`${ROUTES.contact}`} className="landing-btn landing-btn-secondary">Contact</a>
              </div>
            </div>
          </div>
        </section>
        <section className="section how-i-work">
          <div className="container">
            <div className="how-i-work-cards">
              <div className="how-i-work-card">
                {homeAssets.locally_sourced && (
                  <div className="how-i-work-image">
                    <img src={homeAssets.locally_sourced} alt="Locally sourced materials" />
                  </div>
                )}
                <div className="how-i-work-card-content">
                  <h3>Proveniență locală</h3>
                  <p>Fiecare creație prinde viață din materiale alese cu grijă. Firele provin de la furnizori locali, sprijinind comunitatea și reducând impactul asupra mediului. Fiecare piesă spune o poveste despre meșteșug, grijă și valori sustenabile.</p>
                </div>
              </div>
              <div className="how-i-work-card">
                {homeAssets.no_waste && (
                  <div className="how-i-work-image">
                    <img src={homeAssets.no_waste} alt="No waste" />
                  </div>
                )}
                <div className="how-i-work-card-content">
                  <h3>Fără risipă</h3>
                  <p>Nimic nu se irosește. Fiecare fir rămas este refolosit, transformat în proiecte colorate din fire diverse sau folosit ca umplutură moale pentru jucării. Este un mod de a onora fiecare material și de a menține un proces prietenos cu planeta.</p>
                </div>
              </div>
              <div className="how-i-work-card">
                {homeAssets.stuffing && (
                  <div className="how-i-work-image">
                    <img src={homeAssets.stuffing} alt="Hypoallergenic stuffing" />
                  </div>
                )}
                <div className="how-i-work-card-content">
                  <h3>Pufos și sigur</h3>
                  <p>Fiecare jucărie este umplută cu un material hipoalergenic, moale și sigur, potrivit pentru toate vârstele. Fiecare piesă este creată pentru a aduce confort și bucurie, lucrată manual cu grijă, de la început până la sfârșit.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
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
        {featuredAnimals.length > 0 && (
          <footer className="home-footer" id="gallery" aria-label="Featured animals">
            <div className="footer-animals">
              {featuredAnimals.map((item, idx) => (
                <NavLink to={`${ROUTES.plushies}`} key={`${item.img}-${idx}`} className="footer-animal-link">
                  <figure className="footer-animal">
                    <span class="footer-animal-name">{item.name}</span>
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
            <h1 className="landing-title">Contact</h1>
            <p className="landing-subtitle">
              Vrei să comanzi un produs sau ai o idee pentru o piesă croșetată/tricotată? Lasă-mi un mesaj și te voi contacta în cel mai scurt timp.
            </p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="contact-name">Nume</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Numele tău"
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="contact-message">Mesaj</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajul tău"
                  required
                />
              </div>
              <button type="submit" className="landing-btn landing-btn-primary">
                Trimite email
              </button>
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
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
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
              { to: ROUTES.plushies, key: 'plushies', label: 'Plushies' },
              { to: ROUTES.homeware, key: 'homeware', label: 'Homeware' },
              { to: ROUTES.wearables, key: 'wearables', label: 'Wearables' },
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
        <Route path={ROUTES.plushies} element={<PlushiesPage />} />
        <Route path={ROUTES.homeware} element={<HomewarePage />} />
        <Route path={ROUTES.wearables} element={<WearablesPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export default App;
