import { useState, useMemo, useEffect } from 'react';
import { ROUTES } from '../utils/constants';
import { useCart } from '../context/CartContext';
import yarnBall1 from '../home/yarn_ball1.webp';
import yarnBall2 from '../home/yarn_ball2.webp';
import yarnBall3 from '../home/yarn_ball3.webp';
import yarnBall4 from '../home/yarn_ball4.webp';
import yarnBall5 from '../home/yarn_ball5.webp';
import yarnBall6 from '../home/yarn_ball6.webp';

function DollPage() {
  const [selectedOutfit, setSelectedOutfit] = useState(0);
  const [localQuantity, setLocalQuantity] = useState(0);
  const { setItemQuantity, cartItems, MAX_QUANTITY } = useCart();
  
  // Pricing structure for each outfit (index-based)
  // You can customize the price for each outfit here
  const outfitPrices = {
    0: 350, // Outfit 1 price
    1: 320, // Outfit 2 price
    2: 350, // Outfit 3 price
    3: 350, // Outfit 4 price
    4: 370, // Outfit 5 price
    5: 300, // Outfit 6 price
    6: 320, // Outfit 7 price
    7: 300, // Outfit 8 price
    8: 300, // Outfit 9 price
    9: 300, // Outfit 10 price
    10: 350, // Outfit 11 price
    11: 370, // Outfit 12 price
    12: 300, // Outfit 13 price
    13: 320, // Outfit 14 price
    14: 400, // Outfit 15 price
    15: 370, // Outfit 16 price
    16: 300, // Outfit 17 price
    17: 350, // Outfit 18 price
    18: 350, // Outfit 19 price
    19: 300, // Outfit 20 price
    20: 350, // Outfit 21 price
    21: 350, // Outfit 22 price
    22: 350, // Outfit 23 price
    23: 300, // Outfit 24 price
    24: 300, // Outfit 25 price
    25: 300, // Outfit 26 price
    26: 400, // Outfit 27 price
    27: 400, // Outfit 28 price
    28: 300, // Outfit 29 price
    29: 400, // Outfit 30 price
    30: 300, // Outfit 31 price
    31: 350, // Outfit 32 price
    32: 320, // Outfit 33 price
    33: 370, // Outfit 34 price
    34: 300, // Outfit 35 price
    35: 300, // Outfit 36 price
    36: 300, // Outfit 37 price
    37: 350, // Outfit 38 price
    default: '-',
  };
  
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
      price: outfitPrices[index] !== undefined ? outfitPrices[index] : outfitPrices.default,
    };
  });

  const currentOutfit = outfits[selectedOutfit];
  const mainImage = currentOutfit?.mainImage || dollyAssets[0] || null;

  // Create doll item object with outfit-specific price
  const dollItem = useMemo(() => {
    const outfitPrice = currentOutfit?.price || outfitPrices.default;
    return {
      id: `doll-outfit-${selectedOutfit}`,
      name: `Păpușă personalizată - Outfit ${selectedOutfit + 1}`,
      price: outfitPrice,
      img: mainImage,
    };
  }, [selectedOutfit, mainImage, currentOutfit]);

  // Check if doll is in cart
  const cartItem = cartItems.find(item => item.id === dollItem.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Initialize local quantity from cart when outfit changes
  useEffect(() => {
    setLocalQuantity(cartQuantity);
  }, [cartQuantity]);

  const canAddMore = localQuantity < MAX_QUANTITY;

  const handleAddToCart = () => {
    setItemQuantity(dollItem, localQuantity);
  };

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
              <div className="doll-price-current"><strong>{dollItem.price} lei</strong></div>
            </div>
            <div className="doll-quantity-section">
              <div className="modal-quantity-container">
                <div className="modal-quantity-row">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (localQuantity > 0) {
                          setLocalQuantity(localQuantity - 1);
                        }
                      }}
                      disabled={localQuantity === 0}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      max={MAX_QUANTITY}
                      value={localQuantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 0;
                        setLocalQuantity(Math.min(Math.max(0, newQuantity), MAX_QUANTITY));
                      }}
                      className="quantity-input"
                      aria-label="Quantity for doll"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => {
                        if (localQuantity < MAX_QUANTITY) {
                          setLocalQuantity(localQuantity + 1);
                        }
                      }}
                      disabled={!canAddMore}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={localQuantity === 0}
                    className="landing-btn landing-btn-primary modal-cta"
                    aria-label={`Add ${localQuantity} doll to cart`}
                  >
                    Adaugă în coș
                  </button>
                </div>
                <div className="modal-quantity-hints">
                  <div className="modal-quantity-hint-left">
                    {localQuantity >= MAX_QUANTITY && (
                      <span className="quantity-limit" aria-label="Maximum quantity reached">
                        Max {MAX_QUANTITY}
                      </span>
                    )}
                  </div>
                  <div className="modal-quantity-hint-right">
                    <span className="modal-quantity-total" style={{ visibility: localQuantity > 0 ? 'visible' : 'hidden' }}>
                      {localQuantity > 0 ? (
                        <>Total: <strong>{(dollItem.price * localQuantity).toFixed(0)} lei</strong></>
                      ) : (
                        <>Total: <strong>0 lei</strong></>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section why-custom-doll">
        <div className="container">
          <p className="doll-price-description">
            <strong>Îți dorești să faci un cadou inedit unei persoane dragi oferindu-i o păpușă ce o reprezintă? Pot realiza o gamă largă de ținute, coafuri și accesorii pentru a crea o păpușă personalizată care să capteze trăsăturile și stilul persoanei careia i-o oferi. </strong>
            <br/><br/>
            Prețul variază în funcție de complexitatea personalizărilor alese: coafura (simplă sau elaborată, cu accesorii sau fără), ținuta (design-ul hainelor, numărul de piese, detalii speciale), accesoriile (genți, bijuterii, obiecte personalizate) și alte elemente speciale.
          </p>
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
    </section>
  );
}

export default DollPage;

