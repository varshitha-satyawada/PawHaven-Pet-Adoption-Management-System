import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <Link className="brand" to="/"><span className="brand-mark">🐾</span><span>PawHaven<small>FIND A FRIEND FOR LIFE</small></span></Link>
      <nav>
        <NavLink to="/">Adopt</NavLink>
        {user?.role === 'ADOPTER' && <NavLink to="/my-requests">My requests</NavLink>}
        {['SHELTER', 'ADMIN'].includes(user?.role) && <NavLink to="/shelter">Shelter desk</NavLink>}
        {user ? (
          <><span className="user-pill">{user.name} · {user.role}</span><button className="button button-quiet button-small" onClick={logout}>Log out</button></>
        ) : (
          <><NavLink to="/login">Log in</NavLink><Link className="button button-primary button-small" to="/register">Join us</Link></>
        )}
      </nav>
    </header>
  );
}
