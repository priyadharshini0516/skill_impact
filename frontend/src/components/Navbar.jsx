import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">🎯 Skill-to-Impact</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/missions">Missions</Link></li>
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}
          {user && <li><Link to="/profile">Profile</Link></li>}
          <li>
            {user ? (
              <div className="user-menu">
                <span className="user-name">👤 {user.name}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn-login" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
