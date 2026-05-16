export default function StarRating({ rating = 0, count }) {
  const filled = Math.round(rating);
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= filled ? "star filled" : "star"} aria-hidden="true">
          ★
        </span>
      ))}
      {count !== undefined && count !== null && (
        <span className="rating-count">({count})</span>
      )}
    </div>
  );
}
