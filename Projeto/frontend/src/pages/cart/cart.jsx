import './cart.css';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCarrinho } from '../../context/carrinhoContext';

function Carrinho() {
  const { carrinho, removerItem, incrementarQuantidade, decrementarQuantidade, total, limparCarrinho } = useCarrinho();

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const navigate = useNavigate();

  const finalizarCompra = () => {
    setMostrarPopup(true);
    limparCarrinho();
  };

  const continuarComprando = () => {
    setMostrarPopup(false);
    navigate('/cardapio-user');
  };

  const sair = () => {
    setMostrarPopup(false);
    navigate('/');
  };

  return (
    <div className="carrinho-page">
      <header className="carrinho-header">
        <Link to="/cardapio-user" className="carrinho-back">
          <FiArrowLeft size={30} />
        </Link>
        <h1>Carrinho</h1>
      </header>

      {carrinho.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <div className="carrinho-itens">
          {carrinho.map((item) => (
            <div key={item._id} className="carrinho-item">
              <img src={item.imgUrl} alt={item.name} />
            <div className="item-info-e-controle"> 
              <div className="item-info">
                <p>{item.name}</p>
                <span>R$ {item.price.toFixed(2)}</span>
                <div className="quantidade-controle">
                  <button onClick={() => decrementarQuantidade(item._id)}>-</button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => incrementarQuantidade(item._id)}>+</button>
                </div>
              </div>
            </div>
              <FiTrash2
                className="item-remove"
                size={20}
                onClick={() => removerItem(item._id)}
              />
            </div>
          ))}
        </div>
      )}

      {carrinho.length > 0 && (
        <div className="carrinho-footer">
          <p>Total: <strong>R$ {total.toFixed(2)}</strong></p>
          <button className="carrinho-finalizar" onClick={finalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      )}

      {mostrarPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Compra Finalizada!</h2>
            <p>Obrigado por comprar conosco.</p>
            <div className="popup-buttons">
              <button onClick={continuarComprando}>Continuar comprando</button>
              <button onClick={sair}>Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrinho;
