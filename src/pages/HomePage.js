import { useState, useMemo, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { animals } from '../animals';
import { ROUTES, CONTACT_EMAIL } from '../utils/constants';
import customDoll from '../home/main_dolly.webp';
import bagKeychain from '../home/bag_keychain.webp';

function HomePage({ onItemClick }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  
  // Refs for animation triggers
  const heroContentRef = useRef(null);
  const howIWorkRef = useRef(null);
  const customDollRef = useRef(null);
  const bagAccessoriesRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Mesaj nou de la ${name}`);
    const body = encodeURIComponent(`${message}`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  }

  // Home assets
  const homeAssets = useMemo(() => {
    try {
      const ctx = require.context('../home', false, /\.(png|jpe?g|webp|gif)$/i);
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
      const ctx = require.context('../dolly', false, /\.(png|jpe?g|webp|gif)$/i);
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

  const featuredAnimals = featuredAnimalsRef.current || [];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToObserve = [
      heroContentRef.current,
      howIWorkRef.current,
      customDollRef.current,
      bagAccessoriesRef.current,
      contactRef.current,
      footerRef.current
    ].filter(Boolean);

    elementsToObserve.forEach(el => {
      observer.observe(el);
      // Check if element is already in view on initial load
      const rect = el.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        el.classList.add('animate-in');
        observer.unobserve(el);
      }
    });

    return () => {
      elementsToObserve.forEach(el => observer.unobserve(el));
    };
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
          <div className="landing-content" ref={heroContentRef}>
            <p className="landing-subtitle">
              Bună! Sunt Irina, iar curiozitatea mea pentru croșetat și tricotat a devenit o pasiune.
              Am împletit, am greșit, am deșirat, dar am descoperit câtă bucurie poate aduce ceva creat cu propriile mâini.
              Totul este realizat cu grijă, din materiale alese local.
              La <i>Croșetele Irinei</i>, fiecare creație este transformată în bucurie, buclă cu buclă.
            </p>
            <div className="landing-actions">
              <a href={`${ROUTES.products}`} className="landing-btn landing-btn-primary">Vezi colecția</a>
              <a href="#contact" className="landing-btn landing-btn-secondary">Contact</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section how-i-work" ref={howIWorkRef}>
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

      <section className="section custom-doll-section" ref={customDollRef}>
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
                  href="#contact" 
                  className="landing-btn landing-btn-primary"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bag-accessories-section" ref={bagAccessoriesRef}>
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
                  href={ROUTES.plushies} 
                  className="landing-btn landing-btn-secondary"
                >
                  Vezi colecția
                </a>
                <a 
                  href="#contact" 
                  className="landing-btn landing-btn-primary"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="bag-accessories-image">
              <img src={bagKeychain} alt="Accesorii pentru genți" />
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact" ref={contactRef}>
        <div className="container">
          <div className="landing-content">
            <h1 className="landing-title">Contact</h1>
            <p className="landing-subtitle">
              Vrei să comanzi o piesă croșetată care nu se regăsește pe site? Lasă-mi un mesaj și te voi contacta în cel mai scurt timp.
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

      {featuredAnimals.length > 0 && (
        <footer className="home-footer" id="gallery" aria-label="Featured animals" ref={footerRef}>
          <div className="footer-animals">
            {featuredAnimals.map((item, idx) => (
              <NavLink
                to={`${ROUTES.plushies}`}
                key={`${item.img}-${idx}`}
                className="footer-animal-link"
                onClick={(e) => { e.preventDefault(); onItemClick(item); }}
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

export default HomePage;

