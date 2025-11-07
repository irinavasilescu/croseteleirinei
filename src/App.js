import './App.css';
import { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';

function App() {
  const CONTACT_EMAIL = 'hello@crosetele-irinei.ro';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`New inquiry from ${name || 'Crochet site'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function Page({ title, children }) {
    return (
      <section className="section">
        <div className="container">
          <h2>{title}</h2>
          {children || <p>Coming soon. Beautiful handmade crochet items will live here.</p>}
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

  const animalImages = importAll(require.context('./animals', true, /\.(png|jpe?g|webp|gif)$/i));

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
  const clothesImages = importAll(require.context('./clothes', true, /\.(png|jpe?g|webp|gif)$/i));

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

  // Food page - loads all images in src/food
  const foodImages = importAll(require.context('./food', true, /\.(png|jpe?g|webp|gif)$/i));

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
  const accessoriesImages = importAll(require.context('./accessories', true, /\.(png|jpe?g|webp|gif)$/i));

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
  const homewareImages = importAll(require.context('./homeware', true, /\.(png|jpe?g|webp|gif)$/i));

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
              { to: '/accessories', key: 'accessories', label: 'Accessories' },
              { to: '/animals', key: 'animals', label: 'Animals' },
              { to: '/clothes', key: 'clothes', label: 'Clothes' },
              { to: '/food', key: 'food', label: 'Food' },
              { to: '/homeware', key: 'homeware', label: 'Homeware' }
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
        <Route path="/" element={<Page title="Home"> 
          <p>Welcome to Croșetele Irinei. Explore our handcrafted crochet collections.</p>
        </Page>} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/clothes" element={<ClothesPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/homeware" element={<HomewarePage />} />
        <Route path="*" element={<Page title="Not found"><p>The page you are looking for does not exist.</p></Page>} />
      </Routes>
    </div>
  );
}

export default App;
