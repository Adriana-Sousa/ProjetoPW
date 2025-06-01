import './cadastro.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { useState, useEffect } from 'react';
//import { useAuth } from '../../context/AuthContext'
import { useAuth } from '../../context/authContext';

function Cadastro() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { signup, authLoading, error, success, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redireciona para a página inicial se já estiver logado
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

    if (!formData.fullname.trim()) {
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    if (formData.password && formData.password.length < 6) {
      return;
    }

    try {
      const result = await signup(formData);
      if (result.success) {
        setFormData({ fullname: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
    }
  };

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
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {authLoading && <p className="loading">Carregando...</p>}
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            name="fullname"
            placeholder="Nome Completo"
            value={formData.fullname}
            onChange={handleFormDataChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleFormDataChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleFormDataChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleFormDataChange}
          />
          <button
            className="cadastro-button"
            type="submit"
            disabled={authLoading}
          >
            {authLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;