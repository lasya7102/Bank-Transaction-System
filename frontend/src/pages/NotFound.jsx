import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card not-found">
        <div className="not-found__icon">
          <Compass size={48} />
        </div>
        <h1>404</h1>
        <p className="muted">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn--primary btn--block">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
