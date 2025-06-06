import './admin.css';
import bgImage from '../../assets/FOTOBASE.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState, useEffect } from 'react';
import usePlatesServices from '../../services/plates';
import { useAuth } from '../../hooks/useAuth';

function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const {
    getPlates,
    addPlate,
    platesList,
    platesLoading,
    refetchPlates,
    setRefetchPlates,
  } = usePlatesServices();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('sobremesa');
  const [ingredientes, setIngredientes] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (refetchPlates) {
      getPlates();
    }
  }, [isAuthenticated, navigate, refetchPlates, getPlates]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoPrato = {
      name: nome,
      description: descricao,
      price: parseFloat(preco),
      category: categoria,
      ingredients: ingredientes
        ? ingredientes.split(',').map((i) => i.trim())
        : [],
      imgUrl: imgUrl || null,
    };

    const response = await addPlate(novoPrato);
    if (response.success) {
      alert('Prato adicionado com sucesso!');
      setNome('');
      setDescricao('');
      setPreco('');
      setCategoria('sobremesa');
      setIngredientes('');
      setImgUrl('');
      setRefetchPlates(true);
    } else {
      alert(`Erro ao adicionar prato: ${response.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <div className="admin-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <header className="admin-header">
        <h1>Bem-vindo Administrador</h1>
      </header>

      <div className="admin-content">
        <section className="admin-section">
          <h2>Total de Pratos</h2>
          <p>{platesLoading ? 'Carregando...' : `${platesList.length} pratos cadastrados.`}</p>
        </section>

        <section className="admin-section">
          <h2>Últimos Registros Adicionados</h2>
          <ul>
            {platesList.slice(-3).reverse().map((plate) => (
              <li key={plate._id || plate.id}>
                {plate.name} - R${Number(plate.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-section">
          <h2>Adicionar Novo Prato</h2>
          <form onSubmit={handleSubmit} className="adicionar-prato-form">
            <input
              type="text"
              placeholder="Nome do prato"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="entrada">Entrada</option>
              <option value="principal">Prato Principal</option>
              <option value="sobremesa">Sobremesa</option>
              <option value="bebida">Bebida</option>
            </select>
            <input
              type="text"
              placeholder="Ingredientes (separados por vírgula)"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            <button type="submit" className="admin-button" disabled={platesLoading}>
              {platesLoading ? 'Adicionando...' : 'Adicionar Prato'}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Trocar Senha</h2>
          <form className="trocar-senha-form">
            <input type="password" placeholder="Senha atual" />
            <input type="password" placeholder="Nova senha" />
            <input type="password" placeholder="Confirmar nova senha" />
            <button className="admin-button">Trocar Senha</button>
          </form>
        </section>

        <div className="admin-icons-links">
          <Link to="/cardapio-admin" className="admin-icon-link" title="Área de Cardápio">
            <MdRestaurantMenu size={24} />
          </Link>
          <button onClick={handleLogout} className="admin-icon-link" title="Sair">
            <FiLogOut size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
