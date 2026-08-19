import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <button className="navbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="navbar__welcome">
        <span className="navbar__greeting">Welcome back</span>
        <span className="navbar__name">{user?.name || "Account Holder"}</span>
      </div>

      <div className="navbar__actions">
        <button
          className="navbar__profile-btn"
          onClick={() => navigate("/profile")}
          aria-label="Profile"
        >
          <User size={20} />
        </button>
        <button className="btn btn--ghost btn--sm navbar__logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
