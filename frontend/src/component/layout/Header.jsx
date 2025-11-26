import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./stylesComponents.css";
import { useAuth } from "../../service/AuthContext";

function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!auth) return null;

  const { user, logout } = auth;

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/");
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo" onClick={() => { closeMenu(); navigate("/home"); }}>
          App Leilão
        </div>

        {/* botão hamburger — visível apenas em telas pequenas */}
        <button
          className={`hamburger ${mobileOpen ? "is-active" : ""}`}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>

        {user && (
          <div className={`menu ${mobileOpen ? "menu--open" : ""}`}>
            <NavLink to="/pessoas" onClick={closeMenu}>Pessoas</NavLink>
            <NavLink to="/profile" onClick={closeMenu}>Perfis</NavLink>
            <NavLink to="/categorias" onClick={closeMenu}>Categorias</NavLink>
            <NavLink to="/leiloes" onClick={closeMenu}>Leilões</NavLink>
            <NavLink to="/meu-perfil" onClick={closeMenu}>Meu Perfil</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
