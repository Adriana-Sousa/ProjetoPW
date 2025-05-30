import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.JPG';
import api from '../../services/api';
import './cardapio.css';
import platesServices from '../../services/plates';
import { autenticado } from '../../context/authContext';
import { adminRole } from '../../context/authContext';

function CardapioPublico() {
  const [pratos, setPratos] = useState([]);
    const [pratoSelecionado, setPratoSelecionado] = useState(null);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    //const { carrinho, adicionarAoCarrinho } = useCarrinho();
  
    const navigate = useNavigate();
      const { getPlates, updatePlate, deletePlate, platesLoading, platesList, refetchPlates, setRefetchPlates } = platesServices();
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
        
          getPlates();
          setPratos(platesList)
          
        
      }, [autenticado, adminRole, navigate, getPlates, refetchPlates]);

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
        {platesList.map((prato) => (
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