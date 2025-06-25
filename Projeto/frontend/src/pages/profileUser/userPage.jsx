import './userPage.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiLogOut, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useCarrinho } from '../../context/carrinhoContext';
import { useFavorites } from '../../context/favoritesContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsersServices from '../../services/users';
import OrderServices from '../../services/orders';
import MessageBox from '../../components/message/message';

const statusMap = {
  Pending: "Preparando",
  Ready: "Pronto para retirada",
  Delivered: "Entregue",
  Cancelled: "Cancelado"
};

function UserPage() {
  const { logout, user } = useAuth();
  const { carrinho } = useCarrinho();
  const { favoritos, removerFavorito, atualizarFavoritos } = useFavorites();
  const { orderLoading, refetchOrders, ordersList, getUserOrders } = OrderServices();
  const [ultimasEscolhas, setUltimasEscolhas] = useState([]);
  const navigate = useNavigate();
  const { changePassword, usersLoading, error: usersError } = useUsersServices();
  const [error, setError] = useState('');
  const [ success, setSuccess] = useState('');

  // Estados para trocar senha
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    const ultimos = [...carrinho].slice(-3).reverse();
    setUltimasEscolhas(ultimos);
  }, [carrinho]);

  useEffect(()=> {
    if(refetchOrders && user?._id){
      getUserOrders(user._id);
    }
  }, [refetchOrders, user?._id]);

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

  const handleLogout = () => {
    atualizarFavoritos();
    logout();
    navigate('/logout');
  };

  // Separar pedidos atuais e anteriores
  const pedidosAtuais = ordersList.filter(
    p => p.pickupStatus === "Pending" || p.pickupStatus === "Ready"
  );
  const pedidosAnteriores = ordersList.filter(
    p => p.pickupStatus === "Delivered" || p.pickupStatus === "Cancelled"
  );

  return (
    <div className="user-page" style={{ backgroundImage: `url(${bgImage})` }}>

      <div className="user-content">
      <div className="user-icons-links">
        <Link to="/cardapio-user" className="user-icon-link" title="Cardápio">
          <FiHome size={20} />
        </Link>
        <Link to="/cart" className="user-icon-link" title="Carrinho">
          <FiShoppingCart size={20} />
        </Link>
        <Link to="/cardapio-user" className="user-icon-link" title="Cardápio">
          <MdRestaurantMenu size={20} />
        </Link>
        <button className="user-icon-link" title="Sair" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </div>
        <div className="user-header">
                {error && (
              <MessageBox
                message= {error}
                type="error"
                onClose={() => setError(false)}
              />
            )}
            {success && (
              <MessageBox
                message= {success}
                type="success"
                onClose={() => setSuccess(false)}
              />
            )}

          <h1>Olá, {user?.fullname || 'Usuário'}</h1>
        </div>

        <div className="user-section">
          <h2>Seus Favoritos</h2>
          {favoritos.length === 0 ? (
            <p>Nenhum prato favoritado ainda.</p>
          ) : (
            <ul>
              {favoritos.map((prato) => (
                <li key={prato._id}>
                  {prato.name}
                  <button onClick={() => removerFavorito(prato._id)} className="remover-btn">
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="user-section">
          <h2>Últimas Escolhas</h2>
          {ultimasEscolhas.length === 0 ? (
            <p>Você ainda não escolheu nenhum prato.</p>
          ) : (
            <ul>
              {ultimasEscolhas.map((prato) => (
                <li key={prato._id}>{prato.name}</li>
              ))}
            </ul>
          )}
        </div>

         <div className="user-section">
          <h2>Pedidos Atuais</h2>
          {orderLoading ? (
            <p>Carregando pedidos...</p>
          ) : pedidosAtuais.length === 0 ? (
            <p>Você não possui pedidos em andamento.</p>
          ) : (
            <ul>
              {pedidosAtuais.map((pedido) => (
                <li key={pedido._id}>
                  <strong>Status:</strong> {statusMap[pedido.pickupStatus] || pedido.pickupStatus}
                  <ul>
                    {pedido.orderItems?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} <b>x{item.quantidade}</b>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="user-section">
          <h2>Pedidos Anteriores</h2>
          {orderLoading ? (
            <p>Carregando pedidos...</p>
          ) : pedidosAnteriores.length === 0 ? (
            <p>Você não possui pedidos anteriores.</p>
          ) : (
            <ul>
              {pedidosAnteriores.map((pedido) => (
                <li key={pedido._id}>
                  <strong>Status:</strong> {statusMap[pedido.pickupStatus] || pedido.pickupStatus}
                  <ul>
                    {pedido.orderItems?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} <b>x{item.quantidade}</b>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <section className="user-section">
          <h2>Trocar Senha</h2>
          {usersError && <p className="error" role="alert">{usersError}</p>}
          <form onSubmit={handlePasswordSubmit} className="trocar-senha-form">
            <div className="form-group" style={{ position: 'relative' }}>
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
                onClick={() => setShowOldPassword((v) => !v)}
                aria-label={showOldPassword ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {passwordErrors.oldPassword && (
                <span id="oldPassword-error" className="error-text">
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
                onClick={() => setShowNewPassword((v) => !v)}
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
                onClick={() => setShowConfirmNewPassword((v) => !v)}
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
      </div>
    </div>
  );
}

export default UserPage;