// Realistic card-shaped skeleton matching ProductCard layout
export default function Skeleton() {
  return (
    <div className="skeleton" aria-hidden="true">
      {/* Image area */}
      <div className="sk-img" />
      {/* Category pill */}
      <div className="sk-line sk-cat" />
      {/* Title — 2 lines */}
      <div className="sk-line sk-title" />
      <div className="sk-line sk-title-short" />
      {/* Stars */}
      <div className="sk-line sk-stars" />
      {/* Price */}
      <div className="sk-line sk-price" />
      {/* Actions */}
      <div className="sk-actions">
        <div className="sk-btn" />
        <div className="sk-btn-sm" />
      </div>
    </div>
  );
}
