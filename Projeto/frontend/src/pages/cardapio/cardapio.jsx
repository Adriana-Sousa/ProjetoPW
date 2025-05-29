import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.jpg';

import prato1 from '../../assets/prato1.jpg';
import prato2 from '../../assets/prato2.jpg';
import prato3 from '../../assets/prato3.png';
import prato4 from '../../assets/prato4.png';
import prato5 from '../../assets/prato5.png';
import prato6 from '../../assets/prato6.png';

import './cardapio.css';

function Cardapio() {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  const pratos = [
    { id: 1, nome: 'Prato 1', imagem: prato1 },
    { id: 2, nome: 'Prato 2', imagem: prato2 },
    { id: 3, nome: 'Prato 3', imagem: prato3 },
    { id: 4, nome: 'Prato 4', imagem: prato4 },
    { id: 5, nome: 'Prato 5', imagem: prato5 },
    { id: 6, nome: 'Prato 6', imagem: prato6 },
  ];

  const adicionarAoCarrinho = (prato) => {
    setCarrinho([...carrinho, prato]);
  };
  
  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        <h1 className="cardapio-title">Cardápio</h1>
        <Link to="/" className="nav-icon"><FiHome size={24} /></Link>
        <div className="carrinho-container">
          <FiShoppingCart size={24} className="nav-icon" onClick={() => setMostrarCarrinho(!mostrarCarrinho)} />
          {mostrarCarrinho && (
            <div className="carrinho-dropdown">
              {carrinho.length === 0 ? <p>Vazio</p> :
                carrinho.map((item, index) => (
                  <div key={index} className="carrinho-item">
                    <img src={item.imagem} alt={item.nome} />
                    <span>{item.nome}</span>
                  </div>
                ))
              }
              <Link to="/cart" className="ir-para-carrinho">
                     Ir para o Carrinho →
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="pratos-grid">
        {pratos.map((prato) => (
          <div key={prato.id} className="prato-card" onClick={() => adicionarAoCarrinho(prato)}>
            <img src={prato.imagem} alt={prato.nome} />
            <p>{prato.nome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardapio;
