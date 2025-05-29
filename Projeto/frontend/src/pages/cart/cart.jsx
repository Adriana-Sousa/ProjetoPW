import './cart.css';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Carrinho() {
  const [itens, setItens] = useState([
    { id: 1, nome: 'Prato 1', imagem: '/assets/prato1.jpg', preco: 25.99 },
    { id: 2, nome: 'Prato 2', imagem: '/assets/prato2.png', preco: 30.50 },
  ]);

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const navigate = useNavigate();

  const total = itens.reduce((acc, item) => acc + item.preco, 0).toFixed(2);

  const removerItem = (id) => {
    const novosItens = itens.filter(item => item.id !== id);
    setItens(novosItens);
  };

  const finalizarCompra = () => {
    setMostrarPopup(true);
  };

  const continuarComprando = () => {
    setMostrarPopup(false);
    navigate('/cardapio');
  };

  const sair = () => {
    setMostrarPopup(false);
    navigate('/');
  };

  return (
    <div className="carrinho-page">
      <header className="carrinho-header">
        <Link to="/cardapio" className="carrinho-back">
          <FiArrowLeft size={30} />
        </Link>
        <h1>Carrinho</h1>
      </header>

      {itens.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <div className="carrinho-itens">
          {itens.map((item) => (
            <div key={item.id} className="carrinho-item">
              <img src={item.imagem} alt={item.nome} />
              <div className="item-info">
                <p>{item.nome}</p>
                <span>R$ {item.preco.toFixed(2)}</span>
              </div>
              <FiTrash2
                className="item-remove"
                size={20}
                onClick={() => removerItem(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      {itens.length > 0 && (
        <div className="carrinho-footer">
          <p>Total: <strong>R$ {total}</strong></p>
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
