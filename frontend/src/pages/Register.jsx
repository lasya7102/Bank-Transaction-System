import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import * as authService from "../services/authService";

function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message === "Network Error") return "Unable to reach the server. Please check your connection.";
  return "Registration failed. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
const { setUser, setIsAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name.trim()) return "Full name is required.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Password and confirm password do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
  const data = await authService.register({
    name: name.trim(),
    email,
    password,
  });

  setIsAuthenticated(true);

  if (data?.user) {
    setUser(data.user);
  }

  navigate("/dashboard", { replace: true });
}catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <Landmark size={36} />
          <span>LedgerBank</span>
        </div>

        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Get started with a secure digital wallet.</p>

        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <div className="form-field__input-wrap">
              <User size={18} className="form-field__icon" />
              <input
                id="name"
                type="text"
                placeholder="Lasya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="form-field__input-wrap">
              <Mail size={18} className="form-field__icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="form-field__input-wrap">
              <Lock size={18} className="form-field__icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="form-field__toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="form-field__input-wrap">
              <Lock size={18} className="form-field__icon" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? <Loading message="Creating account..." size={18} /> : "Create Account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
