import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.jpg';
import api from '../../services/api';
import './cardapio.css';

function CardapioPublico() {
  const [pratos, setPratos] = useState([]);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const response = await api.get('/plates');
        console.log(response.data);
        console.log(response.data.body[0]);
        setPratos(response.data.body);
      } catch (error) {
        console.error('Erro ao buscar pratos:', error);
      }
    };

    fetchPratos();
  }, []);

  const abrirModal = (prato) => {
    setPratoSelecionado(prato);
  };

  const fecharModal = () => {
    setPratoSelecionado(null);
  };

  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        <h1 className="cardapio-title">Cardápio</h1>
        <Link to="/" className="nav-icon"><FiHome size={24} /></Link>
      </nav>

      <div className="pratos-grid">
        {pratos.map((prato) => (
          <div key={prato._id} className="prato-card" onClick={() => abrirModal(prato)}>
            <img src={prato.imgUrl} alt={prato.name} />
            <p>{prato.name}</p>
          </div>
        ))}
      </div>

      {pratoSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{pratoSelecionado.name}</h2>
            <p style={{ marginBottom: '1rem' }}>Para adicionar, entre na sua conta.</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={() => navigate('/login')}>Entrar</button>
              <button className="modal-button-outline" onClick={() => navigate('/cadastro')}>Cadastrar-se</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardapioPublico;
