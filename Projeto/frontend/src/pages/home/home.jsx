import { Link } from 'react-router-dom';
import './home.css';
import bgImage from '../../assets/HOME.jpg';

function Home() {
  return (<div 
      className="home-page" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="home-container">
        <h1>It's Tasty</h1>
        <Link to="/login">
          <button className="home-button">Entrar</button>
        </Link>
        <Link to="/cardapio">
          <button className="home-button">Ver Cardápio</button>
        </Link>
        <p>
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Home;
