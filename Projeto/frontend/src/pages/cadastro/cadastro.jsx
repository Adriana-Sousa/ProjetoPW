import './cadastro.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { useState } from 'react';
import authServices from '../../services/auth';

function Cadastro() {
  const [formData, setFormData] = useState(null)
  const { login, signup, authLoading } = authServices()

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   // função para mudar os dados
    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          
        })
        console.log(formData)
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
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não combinam.");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      e.preventDefault()
      console.log(formData)
      console.log("ola")
      signup(FormData)
    } catch (error) {
      setError("Falha ao cadastrar o usuário. Tente novamente.");
      console.log(error)
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
        <form onSubmit={handleSubmitForm}>
        <input type="email"
                name="email" placeholder="Email"
                onChange={handleFormDataChange} />
        <input  type="fullname"
                name="fullname" placeholder="User"
                onChange={handleFormDataChange} />
        <input type="password"
                name="password" placeholder="Senha"
                onChange={handleFormDataChange} />
        <input type="password" name="confirmPassword" placeholder="Confirmar Senha"
              onChange={handleFormDataChange} />
        <button className="cadastro-button" type="submit" >Cadastrar</button>
        </form>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>

      </div>
    </div>
  );
}

export default Cadastro;