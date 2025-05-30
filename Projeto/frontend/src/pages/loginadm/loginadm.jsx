import './loginadm.css';
import bgImage from '../../assets/FOTOBASE.png';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { TextField } from "@mui/material"
import { useEffect } from 'react';
import authServices from '../../services/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAdm() {

    const authData = JSON.parse(localStorage.getItem('auth'))
    const { login, signup, authLoading } = authServices()
    const [formData, setFormData] = useState(null)
    const navigate = useNavigate()
    
        useEffect(() => {
            if(authData) {
                if (authData.user.role === "admin") {
                    navigate('/admin')
                }
                else {
                    navigate('/sem-autorizacao')
                }
                 
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
      <h1>OLÁ ADMINISTRADOR</h1>
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
      
      
    </div>
    </div>
  );
}

export default LoginAdm;