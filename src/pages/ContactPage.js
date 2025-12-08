import { useState, useMemo } from 'react';
import { CONTACT_EMAIL } from '../utils/constants';

function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

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

export default ContactPage;

