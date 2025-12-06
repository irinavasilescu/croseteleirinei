import './App.css';
import { useState, useMemo, useEffect, useRef } from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';

import { animals } from './animals';
import { wearables } from './wearables';
import { homeware } from './homeware';

import plushies from './products/plushies.png';
import beanies from './products/beanies.png';
import baskets from './products/baskets.png';
import dolls from './products/dolls.png';
import customDoll from './home/main_dolly.png';
import bagKeychain from './home/bag_keychain.png';

import yarnBall1 from './home/yarn_ball1.png';
import yarnBall2 from './home/yarn_ball2.png';
import yarnBall3 from './home/yarn_ball3.png';
import yarnBall4 from './home/yarn_ball4.png';
import yarnBall5 from './home/yarn_ball5.png';
import yarnBall6 from './home/yarn_ball6.png';

function App() {
  const CONTACT_EMAIL = 'croseteleirinei@gmail.com';

  const ROUTES = {
    plushies: '/plushies',
    homeware: '/homeware',
    wearables: '/wearables',
    contact: '/contact',
    products: '/products',
    home: '/',
    dolls: '/dolls',
  };

  const ITEMS_PER_PAGE = 12;

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

  // Stable featured animals for HomePage (avoid reshuffle on modal open)
  const featuredAnimalsRef = useRef(null);
  if (!featuredAnimalsRef.current) {
    const pool = [...animals];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    featuredAnimalsRef.current = pool.slice(0, Math.min(15, pool.length));
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

  function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const goTo = (p) => {
      if (p < 1 || p > totalPages || p === currentPage) return;
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
      <nav className="pagination" aria-label="Pagination">
        <button
          className="pagination-button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination-button${p === currentPage ? ' is-active' : ''}`}
            onClick={() => goTo(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next ›
        </button>
      </nav>
    );
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
              {item.is_new &&(
                <span className="badge-new" aria-label="Produs nou">Nou</span>
              )}
              <img src={item.img} alt={item.name} />
            </div>
            <div className="modal-info">
              <h2 className="modal-title">{item.name}</h2>
              {typeof item.in_stock === 'boolean' && (
                <div className="modal-stock">
                  <span className={`modal-stock-badge ${item.in_stock ? 'is-in-stock' : 'is-out-of-stock'}`}>
                    <span className="modal-stock-dot" aria-hidden="true" />
                    <span className="modal-stock-text">{item.in_stock ? 'În stoc' : 'Pe comandă'}</span>
                  </span>
                </div>
              )}
              {item.tags?.length && (
                <div className="modal-tags">
                  {item.tags.map(tag => (
                    <span key={tag} className={getTagClassName(tag)}>
                      <span className="modal-tag-text">#{tag}</span>
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

              <a href={`${ROUTES.contact}`} className="landing-btn landing-btn-primary modal-cta">Contact</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PlushiesPage() {
    const location = useLocation();
    const plushies = useMemo(() => {
      return [...animals];
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(plushies.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = plushies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              {currentItems.map((item, idx) => (
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
                  {item.is_new &&(
                    <span className="badge-new" aria-label="Produs nou">Nou</span>
                  )}
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </section>
    );
  }

  function WearablesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(wearables.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = wearables.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <section className="section">
        <div className="container">
          {wearables.length === 0 ? (
            <p>No wearables found.</p>
          ) : (
            <div className="animals-grid">
              {currentItems.map((item, idx) => (
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
                  {item.is_new &&(
                    <span className="badge-new" aria-label="Produs nou">Nou</span>
                  )}
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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

  // Dolly assets
  const dollyAssets = useMemo(() => {
    try {
      const ctx = require.context('./dolly', false, /\.(png|jpe?g|webp|gif)$/i);
      const images = [];
      ctx.keys().forEach((k) => {
        images.push(ctx(k));
      });
      return images.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    } catch (e) {
      return [];
    }
  }, []);

  function HomePage() {
    const featuredAnimals = featuredAnimalsRef.current || [];
    const newProducts = useMemo(() => {
      return [...wearables, ...animals, ...homeware].filter(item => item && item.is_new);
    }, []);

    return (
      <>
        <section className="landing-hero">
          <div className="landing-banner">
            {(homeAssets.banner_large || homeAssets.banner || homeAssets.banner_small) && (
              <picture>
                {homeAssets.banner_small && (
                  <source media="(max-width: 768px)" srcSet={homeAssets.banner_small} />
                )}
                <img
                  src={homeAssets.banner_large || homeAssets.banner || homeAssets.banner_small}
                  alt=""
                  role="presentation"
                />
              </picture>
            )}
          </div>
          <div className="landing-container">
            <div className="landing-content">
              <p className="landing-subtitle">
                Bună! Sunt Irina, iar curiozitatea mea pentru croșetat și tricotat a devenit o pasiune.
                Am împletit, am greșit, am deșirat, dar am descoperit câtă bucurie poate aduce ceva creat cu propriile mâini.
                Totul este realizat cu grijă, din materiale alese local.
                La <i>Croșetele Irinei</i>, fiecare creație este transformată în bucurie, buclă cu buclă.
              </p>
              <div className="landing-actions">
                <a href={`${ROUTES.products}`} className="landing-btn landing-btn-primary">Vezi colecția</a>
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
                  <h3>
                    <img />
                    Proveniență locală
                  </h3>
                  <p>Firele provin de la furnizori locali, sprijinind comunitatea și reducând impactul asupra mediului. Fiecare creație prinde viață din materiale alese cu grijă și spun o poveste despre valori sustenabile.</p>
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
                  <p>Nimic nu se irosește. Orice fir rămas este refolosit, transformat în proiecte colorate și texturi diverse sau folosit ca umplutură moale pentru jucării. Este un mod de a prețui materialul și de a menține un proces prietenos cu planeta.</p>
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
                  <p>Toate jucăriile sunt umplute cu melană hipoalergenică, moale și sigură, potrivită pentru toate vârstele. Obiectele sunt create pentru a aduce confort și bucurie, lucrate manual cu atenție de la început până la sfârșit.</p>
                </div>
              </div>
              <div className="how-i-work-card">
                {homeAssets.custom && (
                  <div className="how-i-work-image">
                    <img src={homeAssets.custom} alt="Personalizare" />
                  </div>
                )}
                <div className="how-i-work-card-content">
                  <h3>Personalizare</h3>
                  <p>Fiecare produs poate fi realizat pe comandă, exact după preferințele tale, de la culori, dimensiuni, modele, până la cele mai mici detalii. Astfel, primești o piesă cu adevărat unică, creată special pentru tine sau pentru cei dragi.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="doll-carousel-section">
          <div className="doll-carousel-container">
            <div className="doll-carousel-track">
              {dollyAssets.map((doll, index) => (
                <NavLink 
                  key={`doll-${index}`} 
                  to={ROUTES.dolls} 
                  className="doll-carousel-item"
                >
                  <img src={doll} alt={`Doll ${index + 1}`} />
                </NavLink>
              ))}
              {/* Duplicate for seamless loop */}
              {dollyAssets.map((doll, index) => (
                <NavLink 
                  key={`doll-duplicate-${index}`} 
                  to={ROUTES.dolls} 
                  className="doll-carousel-item"
                >
                  <img src={doll} alt={`Doll ${index + 1}`} />
                </NavLink>
              ))}
            </div>
          </div>
        </section>

        <section className="section custom-doll-section">
          <div className="container">
            <div className="custom-doll-content">
              <div className="custom-doll-image">
                <img src={customDoll} alt="Păpușă personalizată" />
              </div>
              <div className="custom-doll-text">
                <h2 className="custom-doll-title">Păpuși personalizate</h2>
                <p className="custom-doll-description">
                  Creez păpuși personalizate cu ținute, coafuri și accesorii ce capteaza trăsăturile și stilul persoanei pe care o reprezintă. 
                  Este perfectă pentru un cadou unic și personal sau pentru a captura momente prețioase într-o formă pufoasă și creativă.
                </p>
                
                <div className="custom-doll-faq">
                  <div className="custom-doll-faq-item">
                    <h3 className="custom-doll-faq-question">
                      <img src={homeAssets.bullet}/>
                      Dimensiunea păpușilor
                    </h3>
                    <p className="custom-doll-faq-answer">
                      Păpușile au înălțimea de aproximativ 35-40 cm, fiind perfecte pentru joc sau expunere.
                    </p>
                  </div>
                  <div className="custom-doll-faq-item">
                    <h3 className="custom-doll-faq-question">
                      <img src={homeAssets.bullet}/>
                      Materialele folosite
                    </h3>
                    <p className="custom-doll-faq-answer">
                      Folosesc fire de calitate, provenite de la furnizori locali, și melană hipoalergenică pentru umplutură, sigură pentru toate vârstele.
                    </p>
                  </div>
                  <div className="custom-doll-faq-item">
                    <h3 className="custom-doll-faq-question">
                      <img src={homeAssets.bullet}/>
                      Timpul de realizare
                    </h3>
                    <p className="custom-doll-faq-answer">
                      Fiecare păpușă personalizată necesită între 2-3 săptămâni pentru realizare, în funcție de complexitatea designului.
                    </p>
                  </div>
                  <div className="custom-doll-faq-item">
                    <h3 className="custom-doll-faq-question">
                      <img src={homeAssets.bullet}/>
                      Transport și livrare
                    </h3>
                    <p className="custom-doll-faq-answer">
                      Livrez prin curier. Detaliile despre costuri și timpii de livrare le putem discuta la momentul comenzii.
                    </p>
                  </div>
                </div>

                <div className="custom-doll-cta-container">
                  <a 
                    href={ROUTES.dolls} 
                    className="landing-btn landing-btn-secondary"
                  >
                    Vezi colecția
                  </a>
                  <a 
                    href={ROUTES.contact} 
                    className="landing-btn landing-btn-primary"
                  >
                    Comandă
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section bag-accessories-section">
          <div className="container">
            <div className="bag-accessories-content">
              <div className="bag-accessories-text">
                <h2 className="bag-accessories-title">Accesorii pentru genți, brelocuri și jucării</h2>
                <p className="bag-accessories-description">
                  Descoperă colecția de accesorii pentru genți, brelocuri și jucării croșetate. Fiecare produs îmbină creativitatea cu funcționalitatea, transformând obiectele de zi cu zi în mici bucurii pline de culoare.
                </p>
                <p className="bag-accessories-description">
                  Alege dintre brelocuri adorabile, jucării croșetate și accesorii decorative pentru genți, perfecte pentru a-ți personaliza stilul sau pentru a oferi un cadou unic celor dragi.
                </p>
                <p className="bag-accessories-description">
                  Fie că îți dorești un detaliu simpatic pentru geanta preferată sau un mic companion croșetat, aici vei găsi accesorii care aduc un strop de farmec și originalitate în fiecare zi.
                </p>
                <p className="bag-accessories-description bag-accessories-highlight">
                  Dacă îți dorești ceva personalizat, care nu se regăsește în colecția actuală de pe site, îți stau cu drag la dispoziție. Pot crea modele la comandă, după preferințele tale, pentru a obține exact accesoriul sau jucăria pe care ți le imaginezi.
                </p>
                <div className="bag-accessories-cta-container">
                  <a 
                    href={ROUTES.products} 
                    className="landing-btn landing-btn-secondary"
                  >
                    Vezi colecția
                  </a>
                  <a 
                    href={ROUTES.contact} 
                    className="landing-btn landing-btn-primary"
                  >
                    Comandă
                  </a>
                </div>
              </div>
              <div className="bag-accessories-image">
                <img src={bagKeychain} alt="Accesorii pentru genți" />
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
                <NavLink
                  to={`${ROUTES.plushies}`}
                  key={`${item.img}-${idx}`}
                  className="footer-animal-link"
                  onClick={(e) => { e.preventDefault(); setSelectedItem(item); }}
                >
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
            <h1 className="landing-title">Contact</h1>
            <p className="landing-subtitle">
              Vrei să comanzi un produs sau ai o idee pentru o piesă croșetată sau tricotată? Lasă-mi un mesaj și te voi contacta în cel mai scurt timp.
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
            <div className="landing-social contact-social">
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
    );
  }

  function HomewarePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(homeware.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = homeware.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <section className="section">
        <div className="container">
          {homeware.length === 0 ? (
            <p>No homeware found.</p>
          ) : (
            <div className="animals-grid">
              {currentItems.map((item, idx) => (
                <figure className="animal-card" key={idx} onClick={() => setSelectedItem(item)}>
                  {item.is_new &&(
                    <span className="badge-new" aria-label="Produs nou">Nou</span>
                  )}
                  <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
                </figure>
              ))}
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </section>
    );
  }

  function ProductsPage() {
    return (
      <section className="section">
        <div className="container">
          <div className="animals-grid">
            <figure className="animal-card background-image">
              <NavLink to={ROUTES.dolls}>
                <img src={dolls} alt='dolls' loading="lazy" />
              </NavLink>
            </figure>

            <figure className="animal-card background-image">
              <NavLink to={ROUTES.plushies}>
                <img src={plushies} alt='plushies' loading="lazy" />
              </NavLink>
            </figure>

            <figure className="animal-card background-image">
              <NavLink to={ROUTES.wearables}>
                <img src={beanies} alt='beanies' loading="lazy" />
              </NavLink>
            </figure>

            <figure className="animal-card background-image">
              <NavLink to={ROUTES.homeware}>
                <img src={baskets} alt='baskets' loading="lazy" />
              </NavLink>
            </figure>
          </div>
        </div>
      </section>
    );
  }

  function DollPage() {
    const [selectedOutfit, setSelectedOutfit] = useState(0);
    
    const outfits = dollyAssets.map((dolly, index) => {
      return {
        id: index,
        mainImage: dolly || null,
        thumbnail: dolly || null,
      };
    });

    const currentOutfit = outfits[selectedOutfit];
    const mainImage = currentOutfit?.mainImage || dollyAssets[0] || null;

    return (
      <section className="section doll-page">
        <div className="container">
          <div className="doll-page-content">
            <div className="doll-page-image">
              {mainImage && (
                <img src={mainImage} alt={currentOutfit?.name || 'Păpușă croșetată'} />
              )}
            </div>
            <div className="doll-page-info">
              <div className="doll-outfit-selection">
                <div className="doll-outfit-options">
                  {outfits.map((outfit, index) => (
                    <div
                      key={index}
                      className={`doll-outfit-option ${selectedOutfit === index ? 'is-selected' : ''}`}
                      onClick={() => setSelectedOutfit(index)}
                    >
                      {selectedOutfit === index && (
                        <span className="doll-outfit-checkmark" aria-label="Selected">✔</span>
                      )}
                      {outfit.thumbnail && (
                        <img 
                          src={outfit.thumbnail} 
                          alt={`Outfit ${index + 1}`} 
                          className="doll-outfit-thumbnail"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section why-custom-doll">
          <div className="container">
            <h2 className="why-custom-doll-title">De ce să alegi o păpușă personalizată?</h2>
            <div className="why-custom-doll-list">
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall1} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Unică</h3>
                  <p className="why-custom-doll-text">
                    Fiecare păpușă este creată pe baza trăsăturilor și stilului persoanei reprezentate, de la coafură și culoarea ochilor, la ținută și accesorii.
                  </p>
                </div>
              </div>
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall2} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Lucrată manual cu grijă</h3>
                  <p className="why-custom-doll-text">
                    Toate păpușile sunt croșetate manual, cu atenție la detalii, astfel încât fiecare creație este unică și de calitate superioară.
                  </p>
                </div>
              </div>
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall3} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Cadou cu semnificație specială</h3>
                  <p className="why-custom-doll-text">
                    O păpușă personalizată este mai mult decât un obiect, este un simbol al afecțiunii și al legăturii dintre tine și persoana dragă.
                  </p>
                </div>
              </div>
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall4} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Creativă și jucăușă</h3>
                  <p className="why-custom-doll-text">
                    Păpușile croșetate adaugă un strop de magie și culoare în orice spațiu și sunt perfecte pentru copii, colecționari sau iubitorii de handmade.
                  </p>
                </div>
              </div>
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall5} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Sigură și durabilă</h3>
                  <p className="why-custom-doll-text">
                    Materialele folosite sunt moi, prietenoase cu pielea și rezistente, astfel încât păpușa să fie păstrată mulți ani.
                  </p>
                </div>
              </div>
              <div className="why-custom-doll-item">
                <div className="why-custom-doll-image">
                  <img src={yarnBall6} alt="Yarn ball" />
                </div>
                <div className="why-custom-doll-content">
                  <h3 className="why-custom-doll-heading">Perfectă pentru orice ocazie</h3>
                  <p className="why-custom-doll-text">
                    Ideală pentru cadouri sau pur și simplu pentru a surprinde o persoană dragă într-un mod original.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="doll-page-cta-container">
          <a 
            href={ROUTES.contact} 
            className="landing-btn landing-btn-primary doll-page-cta"
          >
            Comandă
          </a>
        </div>
      </section>
    );
  }

  // Keep page component identities stable across renders to preserve internal state (pagination)
  const PlushiesPageStable = useRef(PlushiesPage).current;
  const HomewarePageStable = useRef(HomewarePage).current;
  const WearablesPageStable = useRef(WearablesPage).current;

  return (
    <div className="App">
      <header className="site-header">
        <div className="container header-inner">
          <nav className="nav nav-tabs">
            {[
              { to: ROUTES.home, key: 'home', label: 'Home', end: true },
              { to: ROUTES.dolls, key: 'dolls', label: 'Dolls' },
              { to: ROUTES.products, key: 'products', label: 'Products' },
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
        <Route path={ROUTES.plushies} element={<PlushiesPageStable />} />
        <Route path={ROUTES.homeware} element={<HomewarePageStable />} />
        <Route path={ROUTES.wearables} element={<WearablesPageStable />} />
        <Route path={ROUTES.products} element={<ProductsPage/>} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.dolls} element={<DollPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export default App;
