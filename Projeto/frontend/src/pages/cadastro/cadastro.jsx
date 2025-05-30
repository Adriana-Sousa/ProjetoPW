import './cadastro.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { useState } from 'react';

function Cadastro() {

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   // função para mudar os dados
    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

  // função para enviar forms
  const handleSubmitForm =  (e) => {
    if (!formData.fullname.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Insira um e-mail válido.");
      return;
    }
    if (!formData.role) {
      setError("Selecione uma função.");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      e.preventDefault()
      console.log(formData)
      singup(FormData)
    } catch (error) {
      setError("Falha ao cadastrar o usuário. Tente novamente.");
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