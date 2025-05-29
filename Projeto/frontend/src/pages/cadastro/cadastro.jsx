import './cadastro.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

function Cadastro() {
  return (
    <div 
      className="cadastro-page" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="cadastro-container">
        <div style={{ position: 'absolute', top: '20px', right: '10px' }}>
          <Link to="/">
            <FiHome size={20} color="white" />
          </Link>
        </div>
        <h1>CADASTRO</h1>
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="User" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirmar Senha" />
        <button className="cadastro-button">Cadastrar</button>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>

      </div>
    </div>
  );
}

export default Cadastro;
