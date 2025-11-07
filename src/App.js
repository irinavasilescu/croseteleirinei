import './App.css';
import { useState, useMemo } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';

function App() {
  const CONTACT_EMAIL = 'croseteleirinei@gmail.com';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`New inquiry from ${name || 'Crochet site'}`);
    const body = encodeURIComponent(`${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

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

  // Animals page - loads all images in src/animals
  function importAll(r) {
    try {
      return r.keys().map((key) => ({
        src: r(key),
        name: key
          .replace(/^\.\//, '')
          .replace(/\.(png|jpe?g|webp|gif)$/i, '')
          .replace(/[_-]+/g, ' '),
      }));
    } catch (e) {
      return [];
    }
  }

  const animalImages = useMemo(
    () => importAll(require.context('./animals', true, /\.(png|jpe?g|webp|gif)$/i)),
    []
  );

  function AnimalsPage() {
    return (
      <section className="section">
        <div className="container">
          {animalImages.length === 0 ? (
            <p>No animal photos found in <code>src/animals</code>.</p>
          ) : (
            <div className="animals-grid">
              {animalImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Clothes page - loads all images in src/clothes
  const clothesImages = useMemo(
    () => importAll(require.context('./clothes', true, /\.(png|jpe?g|webp|gif)$/i)),
    []
  );

  // Abstract page - loads all images in src/abstract
  const abstractImages = importAll(require.context('./abstract', true, /\.(png|jpe?g|webp|gif)$/i));

  function ClothesPage() {
    return (
      <section className="section">
        <div className="container">
          {clothesImages.length === 0 ? (
            <p>No clothes photos found in <code>src/clothes</code>.</p>
          ) : (
            <div className="animals-grid">
              {clothesImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
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
          {abstractImages.length === 0 ? (
            <p>No abstract photos found in <code>src/abstract</code>.</p>
          ) : (
            <div className="animals-grid">
              {abstractImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Food page - loads all images in src/food
  const foodImages = useMemo(
    () => importAll(require.context('./food', true, /\.(png|jpe?g|webp|gif)$/i)),
    []
  );

  function FoodPage() {
    return (
      <section className="section">
        <div className="container">
          {foodImages.length === 0 ? (
            <p>No food photos found in <code>src/food</code>.</p>
          ) : (
            <div className="animals-grid">
              {foodImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Accessories page - loads all images in src/accessories
  const accessoriesImages = useMemo(
    () => importAll(require.context('./accessories', true, /\.(png|jpe?g|webp|gif)$/i)),
    []
  );

  function AccessoriesPage() {
    return (
      <section className="section">
        <div className="container">
          {accessoriesImages.length === 0 ? (
            <p>No accessories photos found in <code>src/accessories</code>.</p>
          ) : (
            <div className="animals-grid">
              {accessoriesImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Homeware page - loads all images in src/homeware
  const homewareImages = useMemo(
    () => importAll(require.context('./homeware', true, /\.(png|jpe?g|webp|gif)$/i)),
    []
  );
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
      if (animalImages.length === 0) return [];
      const pool = [...animalImages];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, Math.min(FEATURED_ANIMALS_COUNT, pool.length));
    }, [animalImages]);

    return (
      <>
        <section className="landing-hero">
          <div className="landing-container">
            <div className="landing-content">
              <h1 className="landing-title">Croșetele Irinei</h1>
              <div className="landing-actions">
                <a href="/animals" className="landing-btn landing-btn-primary">Explore</a>
                <a href="/contact" className="landing-btn landing-btn-secondary">Contact</a>
              </div>
              <div className="landing-social">
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
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-social-link"
                  aria-label={`Compose an email to ${CONTACT_EMAIL} in Gmail`}
                >
                  {homeAssets.mail ? (
                    <img src={homeAssets.mail} alt="Email" />
                  ) : (
                    <span>@</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </section>
        {featuredAnimals.length > 0 && (
          <footer className="home-footer" id="gallery" aria-label="Featured animals">
            <div className="footer-animals">
              {featuredAnimals.map((img, idx) => (
                <NavLink to="/animals" key={`${img.src}-${idx}`} className="footer-animal-link">
                  <figure className="footer-animal">
                    <img src={img.src} alt={img.name} loading="lazy" />
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
    return (
      <>
        <div className="contact">
          <p>Have a custom idea or want to say hello? Drop us a message and we’ll get back to you soon.</p>
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
                placeholder="Tell us about your dream crochet piece..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Send message</button>
          </form>
        </div>
      </>
    );
  }


  function HomewarePage() {
    return (
      <section className="section">
        <div className="container">
          {homewareImages.length === 0 ? (
            <p>No homeware photos found in <code>src/homeware</code>.</p>
          ) : (
            <div className="animals-grid">
              {homewareImages.map((img, idx) => (
                <figure className="animal-card" key={idx}>
                  <img src={img.src} alt={img.name} loading="lazy" />
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
              { to: '/', key: 'home', label: 'Home', end: true },
              { to: '/animals', key: 'animals', label: 'Animals' },
              { to: '/food', key: 'food', label: 'Food' },
              { to: '/homeware', key: 'homeware', label: 'Homeware' },
              { to: '/accessories', key: 'accessories', label: 'Accessories' },
              { to: '/clothes', key: 'clothes', label: 'Clothes' },
              { to: '/abstract', key: 'abstract', label: 'Abstract' },
                { to: '/contact', key: 'contact', label: 'Contact' },
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
        <Route path="/" element={<HomePage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/homeware" element={<HomewarePage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/clothes" element={<ClothesPage />} />
        <Route path="/abstract" element={<AbstractPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Page title="Not found"><p>The page you are looking for does not exist.</p></Page>} />
      </Routes>
    </div>
  );
}

export default App;
