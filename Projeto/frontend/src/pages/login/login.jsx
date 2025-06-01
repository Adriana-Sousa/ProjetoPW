import './login.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiLock, FiKey } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';

function Login() {
  const navigate = useNavigate();
  const { login, authLoading, error, success, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redireciona se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/cardapio');
    }
  }, [isAuthenticated, navigate]);

  // Função para mudar os dados
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      console.log(updatedForm);
      return updatedForm;
    });
  };

  // Função para enviar o formulário
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return;
    }
    if (!formData.password.trim()) {
      return;
    }

    try {
      const result = await login(formData);
      console.log("aqui")
      if (result.success) {
        console.log("redirecionando")
        navigate('/cardapio'); // Redireciona imediatamente após login bem-sucedido
      }
    } catch (err) {
      console.error('Erro no login:', err);
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
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {authLoading && <p className="loading">Carregando...</p>}
        <form onSubmit={handleSubmitForm}>
          <div className="input-group">
            <span className="icon"><FiLock /></span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormDataChange}
              required
            />
          </div>
          <div className="input-group">
            <span className="icon"><FiKey /></span>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleFormDataChange}
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={authLoading}
          >
            {authLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <Link to="/cadastro" className="cadastro-link">Cadastre-se</Link>
        <Link to="/loginadm" className="admin-link">Login como Administrador</Link>
      </div>
    </div>
  );
}

export default Login;