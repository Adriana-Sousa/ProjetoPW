import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">
          <h1>It's Tasty - Pratos</h1>
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="icon-link">
            <FaHome title="Home" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
