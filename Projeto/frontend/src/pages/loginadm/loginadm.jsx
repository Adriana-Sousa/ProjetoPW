import './loginadm.css';
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
      <h1>OLÁ ADMINISTRADOR</h1>
      <div className="input-group">
        <span className="icon">🔒</span>
        <input type="text" placeholder="User" />
      </div>
      <div className="input-group">
        <span className="icon">🔑</span>
        <input type="password" placeholder="Senha" />
      </div>
      <Link to="/admin">
      <button className="login-button">Entrar</button>
      </Link>
      
    </div>
    </div>
  );
}

export default Login;
