import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import usePlatesServices from '../../services/plates';

function CardapioPublico() {
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const navigate = useNavigate();
  const { getAvailablePlates, platesList, platesLoading, refetchPlates } = usePlatesServices();

  useEffect(() => {
    getAvailablePlates();
  }, [getAvailablePlates, refetchPlates]);

  const abrirModal = (prato) => {
    setPratoSelecionado(prato);
  };

  const fecharModal = () => {
    setPratoSelecionado(null);
  };

  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        
        <Link to="/" className="nav-icon">
          <FiHome size={24} />
        </Link>
      </nav>
      <h1 className="cardapio-title">Cardápio</h1>

      {platesLoading && <p className="loading">Carregando pratos...</p>}
      {!platesLoading && platesList.length === 0 && <p className="no-plates">Nenhum prato disponível no momento.</p>}

      <div className="pratos-grid">
        {platesList.map((prato) => (
          <div key={prato._id} className="prato-card" onClick={() => abrirModal(prato)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && abrirModal(prato)}>
            <img src={prato.imgUrl || 'https://via.placeholder.com/150'} alt={prato.name} />
            <p>{prato.name}</p>
            <p>R${prato.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {pratoSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{pratoSelecionado.name}</h2>
            <img src={pratoSelecionado.imgUrl || 'https://via.placeholder.com/150'} alt={pratoSelecionado.name} />
            <p style={{ marginBottom: '1rem' }}>Para mais informações e/ou ações, entre na sua conta.</p>
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
