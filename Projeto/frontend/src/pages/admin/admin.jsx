import './admin.css';
import bgImage from '../../assets/FOTOBASE.JPG';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useUsersServices from '../../services/users';
//import usePlatesServices from '../../hooks/usePlatesServices';
import PlatesServices from '../../services/plates';
import useOrderServices from '../../services/order';

const statusMap = {
  Pending: "Preparando",
  Ready: "Pronto para retirada",
  Delivered: "Entregue",
  Cancelled: "Cancelado"
};

const statusOptions = [
  { value: "Pending", label: "Preparando" },
  { value: "Ready", label: "Pronto para retirada" },
  { value: "Delivered", label: "Entregue" },
  { value: "Cancelled", label: "Cancelado" }
];

function AdminPage() {
  const { isAuthenticated, logout, token, user } = useAuth();
  const { orderLoading, refetchOrders, ordersList, getAllOrders, deleteOrder, updateOrder, setRefetchOrders } = useOrderServices();
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
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Estados para formulário de prato
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('sobremesa');
  const [ingredientes, setIngredientes] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  // Estado para edição de status do pedido
  const [editStatusId, setEditStatusId] = useState(null);

  // Estados para mostrar/esconder senha
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pickupStatus: newStatus })
      });
      setRefetchPlates(true);
      setRefetchOrders(true);
    } catch {
      alert('Erro ao atualizar status do pedido');
    }
  };

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

    if(refetchOrders) {
      getAllOrders();
    }

  }, [isAuthenticated, navigate, refetchPlates, token, getPlates, setRefetchPlates, refetchOrders]);

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
            <button
              type="submit"
              className="admin-button"
              disabled={platesLoading}
            >
              {platesLoading ? 'Adicionando...' : 'Adicionar Prato'}
            </button>
          </form>
        </section>

        {/* PEDIDOS DOS CLIENTES */}
        <section className="admin-section">
          <h2>Pedidos dos Clientes</h2>
          {orderLoading ? (
            <p>Carregando pedidos...</p>
          ) : ordersList.length === 0 ? (
            <p>Nenhum pedido encontrado.</p>
          ) : (
            <div className="pedidos-lista">
              {ordersList.map((order) => (
                <div key={order._id} className="pedido-card">
                  <div className="pedido-info">
                    <span>
                      <strong>Cliente:</strong>{' '}
                      {order.userDetails?.[0]?.fullname || 'Desconhecido'}
                    </span>
                    <span>
                      <strong>Data:</strong>{' '}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : '---'}
                    </span>
                    <span>
                      <strong>Status:</strong> {statusMap[order.pickupStatus] || order.pickupStatus || '---'}
                      {editStatusId === order._id ? (
                        <select
                          className="status-select"
                          value={order.pickupStatus}
                          autoFocus
                          onBlur={() => setEditStatusId(null)}
                          onChange={e => {
                            updateOrderStatus(order._id, e.target.value);
                            setEditStatusId(null);
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          className="status-edit-btn"
                          onClick={() => setEditStatusId(order._id)}
                          style={{ marginLeft: 8 }}
                          type="button"
                        >
                          Alterar
                        </button>
                      )}
                    </span>
                  </div>
                  <div className="pedido-itens">
                    <strong>Itens:</strong>
                    <ul>
                      {order.orderItems?.map((item, idx) => (
                        <li key={idx}>
                          {item.name} <b>x{item.quantidade}</b>{' '}
                          <span>- R$ {Number(item.preco).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pedido-total">
                    <strong>Total:</strong> R${' '}
                    {order.orderItems
                      ? order.orderItems
                          .reduce(
                            (acc, item) =>
                              acc + item.preco * item.quantidade,
                            0
                          )
                          .toFixed(2)
                      : '0.00'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTROLE DE PEDIDOS / HISTÓRICO */}
        <section className="admin-section">
          <h2>Controle de Pedidos</h2>
          {orderLoading ? (
            <p>Carregando histórico...</p>
          ) : (
            <div className="pedidos-lista">
              {ordersList
                .filter(order =>
                  order.pickupStatus === "Delivered" || order.pickupStatus === "Cancelled"
                )
                .map((order) => (
                  <div key={order._id} className="pedido-card">
                    <div className="pedido-info">
                      <span>
                        <strong>Cliente:</strong> {order.userDetails?.[0]?.fullname || 'Desconhecido'}
                      </span>
                      <span>
                        <strong>Status:</strong> {statusMap[order.pickupStatus] || order.pickupStatus}
                      </span>
                    </div>
                    <div className="pedido-itens">
                      <strong>Itens:</strong>
                      <ul>
                        {order.orderItems?.map((item, idx) => (
                          <li key={idx}>
                            {item.name} <b>x{item.quantidade}</b>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              {/* Se não houver pedidos entregues/cancelados */}
              {ordersList.filter(order =>
                order.pickupStatus === "Delivered" || order.pickupStatus === "Cancelled"
              ).length === 0 && (
                <p>Nenhum pedido entregue ou cancelado.</p>
              )}
            </div>
          )}
        </section>

        <section className="admin-section">
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
                onClick={() => setShowOldPassword(!showOldPassword)}
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