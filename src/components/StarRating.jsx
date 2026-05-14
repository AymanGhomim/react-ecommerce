function StarRating({ rating, count }) {
  const stars = Math.round(rating);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= stars ? "star filled" : "star"}>
          ★
        </span>
      ))}
      {count && <span className="rating-count">({count})</span>}
    </div>
  );
}

export default StarRating;
