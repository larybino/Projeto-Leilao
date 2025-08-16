import { NavLink, useNavigate } from 'react-router-dom';
import './stylesComponents.css';
import { useAuth } from '../../service/AuthContext';

function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth) return null; 

  const { user, logout } = auth;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => navigate('/')}>App Leilão</div>

        {user && (
          <div className="menu">
            <NavLink to="/pessoas">Pessoas</NavLink>
            <NavLink to="/leiloes">Leilões</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
