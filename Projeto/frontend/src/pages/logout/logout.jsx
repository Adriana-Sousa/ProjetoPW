import { Link } from 'react-router-dom';
import './logout.css';
import bgImage from '../../assets/HOME.jpg';

function Logout() {
  return (
    <div
      className="logout-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="logout-container">
        <h2>Você realizou logout</h2>
        <Link to="/login">
          <button className="logout-button">Fazer login novamente</button>
        </Link>
        <Link to="/">
          <button className="logout-button">Ir para página inicial</button>
        </Link>
      </div>
    </div>
  );
}

export default Logout;
