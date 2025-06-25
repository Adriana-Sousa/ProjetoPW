import './loginadm.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiLock, FiKey } from 'react-icons/fi';
import { useState, useEffect} from 'react';
import { useAuth } from '../../hooks/useAuth';
import MessageBox from '../../components/message/message';

function LoginAdm() {
  const navigate = useNavigate();
  const { login, authLoading, error, success, isAuthenticated, user, setSuccess, setError } = useAuth();
  const [feedeback, setFeedeback] = useState("");

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (success) setSuccess(null);
  }, [success, setSuccess]);

  // Redireciona com base no estado de autenticação
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/sem-autorizacao');
      }
    }
  }, [isAuthenticated, user, navigate]);

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
      const result = await login(formData);
      if (result.success) {
        if (result.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/sem-autorizacao');
        }
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
      {error && (
        <MessageBox
          message= {error}
          type="error"
          onClose={() => setError(false)}
        />
      )}
      {success && (
        <MessageBox
          message= {success}
          type="success"
          onClose={() => setSuccess(false)}
        />
      )}
      <div className="login-container">
        <div style={{ position: 'absolute', top: '20px', right: '10px' }}>
          <Link to="/">
            <FiHome size={20} color="white" />
          </Link>
        </div>
        <h1>OLÁ, ADMINISTRADOR</h1>
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
      </div>
    </div>
  );
}

export default LoginAdm;