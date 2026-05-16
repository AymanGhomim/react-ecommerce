export default function StarRating({ rating, count }) {
  const stars = Math.round(rating || 0);
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= stars ? "star filled" : "star"}>★</span>
      ))}
      {count !== undefined && <span className="rating-count">({count})</span>}
    </div>
  );
}
