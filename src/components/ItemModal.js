import { ROUTES } from '../utils/constants';

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

  const getTagDisplayName = (tag) => {
    switch (tag) {
      case 'toys':
        return 'Jucării';
      case 'bag charms':
        return 'Accesorii pentru geantă';
      case 'keychains':
        return 'Brelocuri';
      default:
        return tag;
    }
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
            {item.price && (
              <div className="modal-price">
                <span className="modal-price-value">{item.price} lei</span>
              </div>
            )}
            {typeof item.in_stock === 'boolean' && (
              <div className="modal-stock">
                <span className={`modal-stock-badge ${item.in_stock ? 'is-in-stock' : 'is-out-of-stock'}`}>
                  <span className="modal-stock-dot" aria-hidden="true" />
                  <span className="modal-stock-text">{item.in_stock ? 'În stoc' : 'Pe comandă'}</span>
                </span>
              </div>
            )}
            {item.description && (
              <div className="modal-description">
                <p>{item.description}</p>
              </div>
            )}
            {item.dimensions && (
              <div className="modal-dimensions">
                <p className="modal-dimensions-value">{item.dimensions}</p>
              </div>
            )}
             {item.tags?.length && (
               <div className="modal-tags">
                 {item.tags.map(tag => (
                   <span key={tag} className={getTagClassName(tag)}>
                     <span className="modal-tag-text">#{getTagDisplayName(tag)}</span>
                   </span>
                 ))}
               </div>
             )}
            <a href={`${ROUTES.contact}`} className="landing-btn landing-btn-primary modal-cta">
                Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

