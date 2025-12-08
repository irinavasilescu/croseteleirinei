function ItemCard({ item, onClick }) {
  return (
    <figure className="animal-card" onClick={onClick}>
      {item.is_new &&(
        <span className="badge-new" aria-label="Produs nou">Nou</span>
      )}
      <img src={item.img} alt={item.name} loading="lazy" id={item.id} />
      {item.price && (
        <div className="animal-card-price">{item.price} lei</div>
      )}
    </figure>
  );
}

export default ItemCard;

