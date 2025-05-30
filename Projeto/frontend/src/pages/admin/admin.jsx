import './admin.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import authServices from '../../services/auth';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import platesServices from '../../services/plates';
import { useEffect } from 'react';


function AdminPage() {
    const { logout } = authServices()
    const navigate = useNavigate()

    const authData = JSON.parse(localStorage.getItem('auth'))
    
        useEffect(() => {
            if(!authData) {
               
                navigate('/')
            }
        }, [authData])

    const handleLogout = () => {
        logout()
        navigate('/')
        alert("Logout realizado.")
        
    }
  return (
    <div 
      className="admin-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="admin-header">
        <h1>Bem-vindo Administrador</h1>
      </header>

      <div className="admin-content">
        <section className="admin-section">
          <h2>Total de Produtos</h2>
            <p>Aqui aparecerá a quantidade total de produtos cadastrados.</p>
        </section>

        <section className="admin-section">
          <h2>Últimos Registros Adicionados</h2>
          <ul>
            <li>Produto 1</li>
            <li>Produto 2</li>
            <li>Produto 3</li>
          </ul>
        </section>

        <section className="admin-section">
          <label className="custom-file-upload">
            <input type="file" />Adicionar Novo Prato</label>

        </section>

        <section className="admin-section">
          <h2>Trocar Senha</h2>
          <form className="trocar-senha-form">
            <input type="password" placeholder="Senha atual" />
            <input type="password" placeholder="Nova senha" />
            <input type="password" placeholder="Confirmar nova senha" />
            <button className="admin-button">Trocar Senha</button>
          </form>
        </section>
        <div className="admin-icons-links">
          <Link to="/cardapio-publico" className="admin-icon-link" title="Área de Cardápio">
          <MdRestaurantMenu size={24} />
          </Link>
          <button onClick={handleLogout} className="admin-icon" title="Sair">
          <FiLogOut size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;