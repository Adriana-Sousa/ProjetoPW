import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import { useCarrinho } from '../../context/carrinhoContext';
import platesServices from '../../services/plates';
import { useNavigate } from 'react-router-dom';
import { autenticado } from '../../context/auth_Context';
import { adminRole } from '../../context/auth_Context';
import { FiLogOut } from 'react-icons/fi';
import authServices from '../../services/auth';
import { useAuth } from '../../context/authContext';

function Cardapio() {
    //const { logout } = authServices()
  const [pratos, setPratos] = useState([]);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const { carrinho, adicionarAoCarrinho } = useCarrinho();
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
    const { getPlates, updatePlate, deletePlate, platesLoading, platesList, refetchPlates, setRefetchPlates, getAvailablePlates } = platesServices();
    const [editingPlate, setEditingPlate] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      ingredients: [],
      price: "",
      available: true,
      category: "",
    });
    const [newIngredient, setNewIngredient] = useState("");
    const [error, setError] = useState("");
  
    const categories = ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas"];
  
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/");
      } else if (refetchPlates) {
        getAvailablePlates();
        setPratos(platesList)
        
      }
    }, [isAuthenticated, navigate, getAvailablePlates, refetchPlates]);

  


  const adicionarItem = (prato) => {
    adicionarAoCarrinho(prato);
  };

  const handleLogout = () => {
        logout()
        alert("Logout realizado.")
        return navigate('/')
    }
  return (
    <>
      <h1 className="cardapio-title">Cardápio</h1>
      <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <nav className="cardapio-navbar">
          <Link to="/" className="nav-icon"><FiHome size={24} /></Link>
          <button onClick={handleLogout} className="admin-icon" title="Sair"></button>
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
              <button className="modal-button" onClick={() => { adicionarItem(pratoSelecionado); setPratoSelecionado(null); }}>Adicionar ao carrinho</button>
              <button className="modal-button-outline" onClick={() => setPratoSelecionado(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
      <div className="pratos-grid">
        {platesList.map((prato) => (
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
