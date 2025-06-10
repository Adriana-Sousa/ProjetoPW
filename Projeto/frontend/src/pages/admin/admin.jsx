// src/pages/AdminPage.jsx
import './admin.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState, useEffect } from 'react';
import usePlatesServices from '../../services/plates';
import useUsersServices from '../../services/users';
import { useAuth } from '../../hooks/useAuth';

function AdminPage() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const {
    getPlates,
    addPlate,
    platesList,
    platesLoading,
    refetchPlates,
    setRefetchPlates,
  } = usePlatesServices();
  const { changePassword, usersLoading, error: usersError } = useUsersServices();

  // Estados para adicionar prato
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('sobremesa');
  const [ingredientes, setIngredientes] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  // Estados para trocar senha
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (refetchPlates) {
      getPlates().catch(() => alert('Erro ao carregar pratos'));
    }
  }, [isAuthenticated, navigate, refetchPlates, getPlates]);

  // Validação da nova senha
  const validatePassword = () => {
    const errors = {};
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!oldPassword) {
      errors.oldPassword = 'Senha antiga é obrigatória';
    }
    if (!newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 5) {
      errors.newPassword = 'A senha deve ter pelo menos 5 caracteres';
    } 
    if (!confirmNewPassword) {
      errors.confirmNewPassword = 'Confirmação da senha é obrigatória';
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'As senhas não coincidem';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manipular mudança no formulário de senha
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Enviar formulário de troca de senha
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const { oldPassword, newPassword } = passwordForm;
    const result = await changePassword(user._id, { oldPassword, newPassword });

    if (result.success) {
      alert('Senha alterada com sucesso!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      alert(`Erro ao alterar senha: ${result.error || 'Erro desconhecido'}`);
    }
  };

  // Enviar formulário de prato
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
      alert(`Erro ao adicionar prato: ${response.error || response.message}`);
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
              aria-label="Nome do prato"
            />
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              aria-label="Descrição do prato"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              aria-label="Preço do prato"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              aria-label="Categoria do prato"
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
              aria-label="Ingredientes do prato"
            />
            <input
              type="text"
              placeholder="URL da Imagem"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              aria-label="URL da imagem do prato"
            />
            <button type="submit" className="admin-button" disabled={platesLoading}>
              {platesLoading ? 'Adicionando...' : 'Adicionar Prato'}
            </button>
          </form>
        </section>

        <section className="admin-section">
          <h2>Trocar Senha</h2>
          {usersError && <p className="error" role="alert">{usersError}</p>}
          <form onSubmit={handlePasswordSubmit} className="trocar-senha-form">
            <div className="form-group">
              <input
                type="password"
                name="oldPassword"
                placeholder="Senha atual"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                disabled={usersLoading}
                aria-label="Senha atual"
                aria-invalid={!!passwordErrors.oldPassword}
                aria-describedby={
                  passwordErrors.oldPassword ? 'oldPassword-error' : undefined
                }
              />
              {passwordErrors.oldPassword && (
                <span id="oldPassword-error" className="error-text">
                  {passwordErrors.oldPassword}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                placeholder="Nova senha"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                disabled={usersLoading}
                aria-label="Nova senha"
                aria-invalid={!!passwordErrors.newPassword}
                aria-describedby={
                  passwordErrors.newPassword ? 'newPassword-error' : undefined
                }
              />
              {passwordErrors.newPassword && (
                <span id="newPassword-error" className="error-text">
                  {passwordErrors.newPassword}
                </span>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirmar nova senha"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                disabled={usersLoading}
                aria-label="Confirmar nova senha"
                aria-invalid={!!passwordErrors.confirmNewPassword}
                aria-describedby={
                  passwordErrors.confirmNewPassword ? 'confirmNewPassword-error' : undefined
                }
              />
              {passwordErrors.confirmNewPassword && (
                <span id="confirmNewPassword-error" className="error-text">
                  {passwordErrors.confirmNewPassword}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="admin-button"
              disabled={usersLoading}
              aria-label="Trocar senha"
            >
              {usersLoading ? 'Alterando...' : 'Trocar Senha'}
            </button>
          </form>
        </section>

        <div className="admin-icons-links">
          <Link to="/cardapio-admin" className="admin-icon-link" title="Área de Cardápio">
            <MdRestaurantMenu size={24} />
          </Link>
          <button
            onClick={handleLogout}
            className="admin-icon-link"
            title="Sair"
            aria-label="Sair"
          >
            <FiLogOut size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;