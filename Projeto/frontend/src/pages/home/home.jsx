import { Link } from 'react-router-dom';
import './home.css';
import bgImage from '../../assets/HOME.jpg';
import { autenticado } from '../../context/authContext';
import { adminRole } from '../../context/authContext';
import AdminPage from '../admin/admin';
import Cardapio from '../cardapio/cardapio';


function Home() {
  return (
  <>
  {
          autenticado?  adminRole? <AdminPage /> : <Cardapio /> : <div 
      className="home-page" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="home-container">
        <h1>It's Tasty</h1>
        <Link to="/login">
          <button className="home-button">Entrar</button>
        </Link>
        <Link to="/cardapio-publico">
          <button className="home-button">Ver Cardápio</button>
        </Link>
        <p>
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div> 
        }
  </>
  
  );
}

export default Home;