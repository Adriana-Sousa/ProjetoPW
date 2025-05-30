import './login.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
 import { useState } from 'react';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // autenticação
    // checar se email e senha não estão vazios
    if (email && password) {
      //autenticar com o backend  
fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      navigate('/cardapio');
    } else {
      alert('E-mail ou senha incorretos.');
    }
  })
  .catch(error => {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao conectar com o servidor.');
  });
      navigate('/'); 
    } else {
      alert('Por favor, preencha o e-mail e a senha.');
    }
  };

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
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <span className="icon">🔑</span>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" onClick={handleLogin}>Entrar</button>

      <Link to="/cadastro" className="cadastro-link">Cadastre-se</Link>
      <Link to="/loginadm" className="admin-link">Login como Administrador</Link>
    </div>
    </div>
  );
}

export default Login;
