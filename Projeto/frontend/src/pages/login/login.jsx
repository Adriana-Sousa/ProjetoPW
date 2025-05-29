import './login.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

function Login() {
  return (
    <div 
      className="login-page" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
     <div className="login-container">
         <div style={{ position: 'absolute', top: '20px', right: '10px' }}>
          <Link to="/">
            <FiHome size={20} color="white" />
          </Link>
        </div>
      <h1>LOGIN</h1>
      <div className="input-group">
        <span className="icon">🔒</span>
        <input type="text" placeholder="E-mail" />
      </div>
      <div className="input-group">
        <span className="icon">🔑</span>
        <input type="password" placeholder="Senha" />
      </div>
      <button className="login-button">Entrar</button>

      <Link to="/cadastro" className="cadastro-link">Cadastre-se</Link>
      <Link to="/loginadm" className="admin-link">Login como Administrador</Link>
    </div>
    </div>
  );
}

export default Login;
