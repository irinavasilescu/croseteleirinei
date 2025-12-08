import { useState, useMemo } from 'react';
import { ROUTES } from '../utils/constants';
import yarnBall1 from '../home/yarn_ball1.webp';
import yarnBall2 from '../home/yarn_ball2.webp';
import yarnBall3 from '../home/yarn_ball3.webp';
import yarnBall4 from '../home/yarn_ball4.webp';
import yarnBall5 from '../home/yarn_ball5.webp';
import yarnBall6 from '../home/yarn_ball6.webp';

function DollPage() {
  const [selectedOutfit, setSelectedOutfit] = useState(0);
  
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
            <div className="doll-price-section">
              <div className="doll-price-range">300 - 400 lei</div>
              <p className="doll-price-description">
                Prețul variază în funcție de complexitatea personalizărilor alese. Fiecare element adăugat influențează costul final: 
                coafura (simplă sau elaborată, cu accesorii sau fără), ținuta (design-ul hainelor, numărul de piese, detalii speciale), 
                accesoriile (genți, bijuterii, obiecte personalizate) și alte elemente speciale. Prețul de bază este pentru o păpușă cu personalizări minime, iar fiecare 
                adăugare sau complexitate suplimentară se reflectă în costul final.
              </p>
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

export default DollPage;

