import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="empty-page">
      <div className="empty-icon">🔍</div>
      <h2>404 — Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
