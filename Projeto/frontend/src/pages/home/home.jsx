import { Link } from 'react-router-dom';
import './home.css';
import bgImage from '../../assets/HOME.jpg';
import { useAuth } from '../../hooks/useAuth';
import AdminPage from '../admin/admin';
//import Cardapio from '../cardapio/cardapioUser';
import { useEffect, useState } from 'react';
import CardapioUsuario from '../cardapio/cardapioUser';

function Home() {
  const { isAuthenticated, user, success, setSuccess} = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (success) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setSuccess(null); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  return (
    <>
      {isAuthenticated ? (
        user?.role === 'admin' ? (
          <AdminPage />
        ) : (
          <CardapioUsuario />
        )
      ) : (
        <div
          className="home-page"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="home-container">
            <h1>It's Tasty</h1>
            <Link to="/login">
              <button className="home-button">Entrar</button>
            </Link>
            <Link to="/cardapio-publico">
              <button className="home-button">Ver Cardápio</button>
            </Link>
            <p>
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
            {showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <p>{success}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;