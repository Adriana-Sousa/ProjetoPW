import './login.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiLock, FiKey } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import MessageBox from '../../components/message/message';

function Login() {
  const navigate = useNavigate();
  const { login, user, authLoading, error, isAuthenticated, success, setSuccess, setError} = useAuth();
  const [feedeback, setFeedeback] = useState("");
  

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
         navigate('/cardapio-user');
        }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (success) setSuccess(null);
  }, [success, setSuccess]);

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
      setFeedeback("Informe um email válido.");
      return;
    }
    if (!formData.password.trim() || formData.password.length <= 5) {
      setFeedeback("Informe sua senha.")
      return;
    }

    try {
      await login(formData);
      // Navegação será tratada pelo useEffect quando isAuthenticated mudar
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {error && (
        <MessageBox
          message= {error}
          type="error"
          onClose={() => setError(false)}
        />
      )}
      <div className="login-container">
        <div style={{ position: 'absolute', top: '20px', right: '10px' }}>
          <Link to="/">
            <FiHome size={20} color="white" />
          </Link>
        </div>
        <h1>LOGIN</h1>
        {feedeback && <p className="error">{feedeback}</p>}
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