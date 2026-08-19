import { User, Mail, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import * as authService from "../services/authService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await authService.getCurrentUser();

        if (data?.user) {
          setProfile(data.user);
          setUser(data.user);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [setUser]);

  if (loading) {
    return (
      <div className="page">
        <Loading message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Profile</h1>
        <p>Your account information.</p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-card__avatar">
            <User size={48} />
          </div>

          <h2>{profile?.name || "Account Holder"}</h2>

          <p className="muted">
            {profile?.email || "Email not available"}
          </p>
        </div>

        <div className="card">
          <h3 className="card__title">Account Details</h3>

          <div className="detail-row">
            <span className="detail-row__label">
              <User size={16} />
              Name
            </span>

            <span className="detail-row__value">
              {profile?.name || "Not available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-row__label">
              <Mail size={16} />
              Email
            </span>

            <span className="detail-row__value">
              {profile?.email || "Not available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-row__label">
              <ShieldCheck size={16} />
              Authentication
            </span>

            <span className="detail-row__value">
              Cookie-based (JWT)
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-row__label">
              <ShieldCheck size={16} />
              Account Type
            </span>

            <span className="detail-row__value">
              {profile?.systemUser ? "System User" : "Regular User"}
            </span>
          </div>
        </div>
      </div>

      <div className="card info-card">
        <div className="info-card__icon">
          <Info size={20} />
        </div>

        <div>
          <h3>About this page</h3>

          <p className="muted">
            Your profile information is loaded from the current-user API
            using your authenticated session.
          </p>
        </div>
      </div>
    </div>
  );
}