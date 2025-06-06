import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';
import bgImage from '../../assets/CARDAPIO.JPG';
import './cardapio.css';
import PlatesServices from '../../services/plates';
import { useAuth } from '../../hooks/useAuth';

function CardapioAdmin() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { getPlates, platesList, platesLoading, deletePlate, updatePlate, refetchPlates } = PlatesServices();
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imgUrl: '',
    ingredients: [],
    category: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/loginadm');
    } else {
        if(refetchPlates){
      getPlates();}
    }
  }, [isAuthenticated, user, navigate, getPlates, refetchPlates]);

  const abrirEditar = (prato) => {
    setPratoSelecionado(prato);
    setFormData({
      name: prato.name,
      price: prato.price.toString(),
      description: prato.description || '',
      imgUrl: prato.imgUrl || '',
      ingredients: prato.ingredients || [],
      category: prato.category || '',
      available: prato.available ?? true,
    });
    setError('');
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    // Validação
    if (!formData.name || !formData.price) {
      setError('Nome e preço são obrigatórios');
      setIsSubmitting(false);
      return;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Preço deve ser um número maior que zero');
      setIsSubmitting(false);
      return;
    }
    if (formData.category && !['entrada', 'principal', 'sobremesa', 'bebida'].includes(formData.category)) {
      setError('Categoria inválida');
      setIsSubmitting(false);
      return;
    }

    const data = {
      ...formData,
      price,
      ingredients: formData.ingredients || [],
    };

    try {
      const result = await updatePlate(pratoSelecionado._id, data);
      if (!result.success) {
        setError(result.message || 'Erro ao atualizar prato');
        alert(`Erro: ${result.message}`);
      } else {
        alert('Prato atualizado com sucesso!');
        setPratoSelecionado(null);
      }
    } catch (error) {
      setError('Erro inesperado ao atualizar prato');
      alert('Erro inesperado ao atualizar prato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que quer excluir?')) {
      try {
        const result = await deletePlate(id);
        if (!result.success) {
          alert(`Erro: ${result.message}`);
        } else {
          alert('Prato excluído com sucesso!');
        }
      } catch (error) {
        alert('Erro ao excluir prato');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <div className="cardapio-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <nav className="cardapio-navbar">
        <button onClick={() => navigate('/admin')} className="nav-icon" title="Painel Admin">
          Voltar
        </button>
        <button onClick={handleLogout} className="nav-icon" title="Sair">
          <FiLogOut size={24} />
        </button>
      </nav>

      {error && <p className="error">{error}</p>}
      {platesLoading ? (
        <p className="loading">Carregando pratos...</p>
      ) : platesList.length === 0 ? (
        <p className="no-plates">Nenhum prato cadastrado.</p>
      ) : (
        <div className="pratos-grid">
          {platesList.map((prato) => (
            <div key={prato._id} className="prato-card">
              {prato.imgUrl ? (
                                      <img
                                        src={prato.imgUrl}
                                        alt={prato.name}

                                      />
                                    ) : (
                                      <img
                                        src="/placeholder.jpg"
                                        alt={prato.name}
                                        
                                      />
                                    )}
              <p>{prato.name}</p>
              <p>R${prato.price.toFixed(2)}</p>
              <div className="admin-buttons">
                <button onClick={() => abrirEditar(prato)} title="Editar">
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(prato._id)} title="Excluir">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pratoSelecionado && (
        <div className="modal-overlay" onClick={() => setPratoSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edição de: {pratoSelecionado.name}</h2>
            {error && <p className="error">{error}</p>}
            <input
              className="modal-input"
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              className="modal-input"
              type="number"
              step="0.01"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
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
              placeholder="URL da Imagem"
              value={formData.imgUrl}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
            />
            <input
              className="modal-input"
              type="text"
              placeholder="Ingredientes (separados por vírgula)"
              value={formData.ingredients.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingredients: e.target.value ? e.target.value.split(',').map((i) => i.trim()) : [],
                })
              }
            />
            <select
              className="modal-input-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Selecione a categoria</option>
              <option value="entrada">Entrada</option>
              <option value="principal">Principal</option>
              <option value="sobremesa">Sobremesa</option>
              <option value="bebida">Bebida</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              />
              Disponível
            </label>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                className="modal-button"
                onClick={() => setPratoSelecionado(null)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardapioAdmin;