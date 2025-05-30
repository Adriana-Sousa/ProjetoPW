import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.jpg';
import api from '../../services/api';
import './cardapio.css';

function Cardapio() {
  const [pratos, setPratos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const response = await api.get('/plates');
        setPratos(response.data.body);
      } catch (error) {
        console.error('Erro ao buscar pratos:', error);
      }
    };

    fetchPratos();
  }, []);

  const adicionarAoCarrinho = (prato) => {
    setCarrinho([...carrinho, prato]);
  };

  return (
    <>
      <h1 className="cardapio-title">Cardápio</h1>
      <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <nav className="cardapio-navbar">
          <Link to="/" className="nav-icon"><FiHome size={24} /></Link>
          <div className="carrinho-container">
            <FiShoppingCart size={24} className="nav-icon" onClick={() => setMostrarCarrinho(!mostrarCarrinho)} />
            {carrinho.length > 0 && (
              <span className="carrinho-count">{carrinho.length}</span>
            )}   
            {mostrarCarrinho && (
              <div className="carrinho-dropdown">
    {carrinho.length === 0 ? (
      <p>Vazio</p>
    ) : (
      <>
        {carrinho.map((item, index) => (
          <div key={index} className="carrinho-item">
            <img src={item.imgUrl} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
        <div className="carrinho-resumo">
          <p><strong>Total de itens:</strong> {carrinho.length}</p>
          <p><strong>Soma:</strong> R$ {carrinho.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
        </div>
      </>
    )}
    <Link to="/cart" className="ir-para-carrinho">
           Ir para o Carrinho →
    </Link>
  </div>
)}
        </div>
      </nav>
      {pratoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{pratoSelecionado.name}</h2>
            <img src={pratoSelecionado.imgUrl} alt={pratoSelecionado.name} style={{width: '100%', borderRadius: '5px', marginBottom: '1rem'}} />
            <p style={{marginBottom: '1rem'}}>{pratoSelecionado.description}</p>
            <p style={{fontWeight: 'bold', marginBottom: '1rem'}}>R$ {pratoSelecionado.price.toFixed(2)}</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={() => { adicionarAoCarrinho(pratoSelecionado); setPratoSelecionado(null); }}>Adicionar ao carrinho</button>
              <button className="modal-button-outline" onClick={() => setPratoSelecionado(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
      <div className="pratos-grid">
        {pratos.map((prato) => (
          <div key={prato._id} className="prato-card" onClick={() => { setPratoSelecionado(prato); }}>
            <img src={prato.imgUrl} alt={prato.name} />
            <p>{prato.name}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Cardapio;
