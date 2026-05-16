import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-page">
      <div className="empty-icon">🔍</div>
      <h2>404 — Page Not Found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
