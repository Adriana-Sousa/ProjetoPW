import './admin.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEye, FiEyeOff, FiTag, FiEdit2, FiDollarSign, FiList, FiImage } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Select from 'react-select';
import useUsersServices from '../../services/users';
import PlatesServices from '../../services/plates';
import MessageBox from '../../components/message/message';

const categoriaOptions = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'principal', label: 'Prato Principal' },
  { value: 'sobremesa', label: 'Sobremesa' },
  { value: 'bebida', label: 'Bebida' }
];

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
  } = PlatesServices();

  // mudar senha
  const { changePassword, usersLoading, error: usersError } = useUsersServices();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Estados para formulário de prato
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  // Estados para mostrar/esconder senha
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
      setRefetchPlates(false);
    }
  }, [isAuthenticated, navigate, refetchPlates, getPlates, setRefetchPlates]);

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
      setSuccess('Senha alterada com sucesso!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setError(`Erro ao alterar senha: ${result.error || 'Erro desconhecido'}`);
    }
  };
 //adicionar um novo prato 
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
// tratamento de respostas
    const response = await addPlate(novoPrato);
    if (response.success) {
      setSuccess('Prato adicionado com sucesso!');
      setNome('');
      setDescricao('');
      setPreco('');
      setCategoria('');
      setIngredientes('');
      setImgUrl('');
      setRefetchPlates(true);
    } else {
      setError(`Erro ao adicionar prato: ${response.error || response.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <div className="admin-page" style={{ backgroundImage: `url(${bgImage})` }}>
      {error && (
        <MessageBox
          message={error}
          type="error"
          onClose={() => setError(false)}
        />
      )}
      {success && (
        <MessageBox
          message={success}
          type="success"
          onClose={() => setSuccess(false)}
        />
      )}
      <header className="admin-header">
        <h1>Bem-vindo Administrador</h1>
      </header>
      <div className="admin-content">
        <section className="admin-section">
          <h2>Gerenciamento de Pedidos</h2>
          <button
            className="admin-pedidos-btn"
            onClick={() => navigate('/admin/pedidos')}
          >
            Ir para pedidos
          </button>
        </section>
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
            <div className="input-icon-group">
              <FiTag className="input-icon" />
              <input
                type="text"
                placeholder="Nome do prato"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="input-icon-group">
              <FiEdit2 className="input-icon" />
              <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="input-icon-group">
              <FiDollarSign className="input-icon" />
              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
            <div className="input-icon-group">
              <FiList className="input-icon" />
              <input
                type="text"
                placeholder="Ingredientes (separados por vírgula)"
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
              />
            </div>
            <div className="input-icon-group">
              <FiImage className="input-icon" />
              <input
                type="text"
                placeholder="URL da Imagem"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </div>
            <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <Select
                options={categoriaOptions}
                value={categoriaOptions.find(opt => opt.value === categoria)}
                onChange={opt => setCategoria(opt.value)}
                placeholder="Selecione a categoria"
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    background: '#181818',
                    borderColor: '#ffe6b0',
                    color: '#fff',
                    borderRadius: 6,
                    boxShadow: 'none',
                    minHeight: '38px',
                    '&:hover': {
                      borderColor: '#ffe6b0',
                    }
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#fff'
                  }),
                  menu: (base) => ({
                    ...base,
                    background: '#181818',
                    color: '#fff'
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isFocused ? '#ffe6b0' : '#181818',
                    color: state.isFocused ? '#181818' : '#fff',
                    cursor: 'pointer'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#ffe6b0'
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: '#ffe6b0'
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    background: '#ffe6b0'
                  })
                }}
              />
            </div>
            <button
              type="submit"
              className="admin-button"
              disabled={platesLoading}
            >
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
                type={showOldPassword ? "text" : "password"}
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
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label={showOldPassword ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {passwordErrors.oldPassword && (
                <span className="error-text">
                  {passwordErrors.oldPassword}
                </span>
              )}
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
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
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {passwordErrors.newPassword && (
                <span id="newPassword-error" className="error-text">
                  {passwordErrors.newPassword}
                </span>
              )}
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
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
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                aria-label={showConfirmNewPassword ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showConfirmNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
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
          <button onClick={handleLogout} className="admin-icon-link" title="Sair">
            <FiLogOut size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
