import './login.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
 import { useState } from 'react';
 import authServices from '../../services/auth';
 import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authData = JSON.parse(localStorage.getItem('auth'))
      const { login, signup, authLoading } = authServices()
      const [formData, setFormData] = useState(null)
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      
          useEffect(() => {
              if(authData) {
                  
                      navigate('/cardapio')
                  }
                   
              
          }, [authData])
  
      // função para enviar forms
      const handleSubmitForm = (e) => {
          e.preventDefault()
              console.log(formData)
          login(formData)
                  
      }
  
       // função para mudar os dados
      const handleFormDataChange = (e) => {
          setFormData({
              ...formData,
              [e.target.name]: e.target.value
          })
          console.log(formData)
      }

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
      <form onSubmit={handleSubmitForm}>
        
        <div className="input-group" >
        <span className="icon">🔒</span>
        <input type="email" name='email' placeholder="User" onChange={handleFormDataChange} required/>
      </div>
      <div className="input-group">
        <span className="icon">🔑</span>
        <input type="password" name='password' placeholder="Senha" onChange={handleFormDataChange} required />
      </div>
      
      <button type='submit' className="login-button" >Entrar</button>
        </form>

      <Link to="/cadastro" className="cadastro-link">Cadastre-se</Link>
      <Link to="/loginadm" className="admin-link">Login como Administrador</Link>
    </div>
    </div>
  );
}

export default Login;