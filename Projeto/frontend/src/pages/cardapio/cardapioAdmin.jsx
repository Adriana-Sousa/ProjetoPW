import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import usePlatesServices from '../../services/plates';
import { useAuth } from '../../hooks/useAuth';

function CardapioAdmin() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { getAvailablePlates, platesList, platesLoading, deletePlate, updatePlate } = usePlatesServices();
  const [refetchPlates, setRefetchPlates] = useState(false);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', imgUrl: '' });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/loginadm');
    } else {
      getAvailablePlates();
    }
  }, [isAuthenticated, user, navigate, getAvailablePlates, refetchPlates]);

  const abrirEditar = (prato) => {
    setPratoSelecionado(prato);
    setFormData({
      name: prato.name,
      price: prato.price,
      description: prato.description,
      imgUrl: prato.imgUrl
    });
  };

 const handleUpdate = async () => {
  await updatePlate(pratoSelecionado._id, formData);
  setPratoSelecionado(null);
  setRefetchPlates(prev => !prev); // forçando recarregar pratos
};

    const handleDelete = async (id) => {
     if (window.confirm('Tem certeza que quer excluir?')) {
         await deletePlate(id);
         setRefetchPlates(prev => !prev); // forçando recarregar pratos
    }
};

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        <button onClick={() => navigate('/admin')} className="nav-icon" title="Painel Admin">Voltar</button>
        <button onClick={handleLogout} className="nav-icon" title="Sair"><FiLogOut size={24} /></button>
      </nav>

      {platesLoading ? <p className="loading">Carregando pratos...</p> : (
        <div className="pratos-grid">
          {platesList.map((prato) => (
            <div key={prato._id} className="prato-card">
              <img src={prato.imgUrl} alt={prato.name} />
              <p>{prato.name}</p>
              <div className="admin-buttons">
                <button onClick={() => abrirEditar(prato)}><FiEdit /></button>
                <button onClick={() => handleDelete(prato._id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pratoSelecionado && (
        <div className="modal-overlay" onClick={() => setPratoSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edição de: {pratoSelecionado.name}</h2>
            <input
              className="modal-input"
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="modal-input"
              type="text"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <textarea
              className="modal-textarea"
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              className="modal-input"
              type="text"
              placeholder="Imagem URL"
              value={formData.imgUrl}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="modal-button" onClick={handleUpdate}>Salvar</button>
              <button className="modal-button" onClick={() => setPratoSelecionado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardapioAdmin;
