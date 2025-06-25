import './pedidosAdmin.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import bgImage from '../../assets/FOTOBASE.JPG';
import OrderServices from '../../services/orders';
import MessageBox from '../../components/message/message';

const statusMap = {
  Pending: "Preparando",
  Ready: "Pronto para retirada",
  Delivered: "Entregue",
  Cancelled: "Cancelado"
};

function PedidosAdmin() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const {
  ordersList,
  orderLoading,
  getAllOrders,
  updateOrderStatus,
  error: ordersError,
  refetchOrders,
} = OrderServices();

useEffect(() => {
  if (isAuthenticated === false) {
    navigate('/login');
    return;
  }
  if (isAuthenticated === true) {
    getAllOrders();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated, navigate]);

useEffect(() => {
  if (isAuthenticated && refetchOrders) {
    getAllOrders();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated, refetchOrders]);

const handleStatusChange = (orderId, newStatus) => {
  updateOrderStatus(orderId, newStatus);
};

  const pedidosFiltrados = ordersList.filter((pedido) => {
    const cliente = String(pedido.userFullname || pedido.user?.fullname || '').toLowerCase();
    const itens = Array.isArray(pedido.orderItems)
      ? pedido.orderItems.map(i => (i?.name || '').toLowerCase()).join(' ')
      : '';
    return (
      cliente.includes(search.toLowerCase()) ||
      itens.includes(search.toLowerCase())
    );
  });

  // Mostra loading enquanto autenticação está indefinida
  if (isAuthenticated === undefined || isAuthenticated === null) {
    return (
      <div className="pedidos-admin-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="pedidos-admin-header-row">
          <h1 className="pedidos-admin-title">Gerenciamento de Pedidos</h1>
        </div>
        <div style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="pedidos-admin-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="pedidos-admin-header-row">
        <h1 className="pedidos-admin-title">Gerenciamento de Pedidos</h1>
        <div className="pedidos-admin-icons">
          <button className="pedidos-admin-icon" onClick={() => navigate('/admin')}>
            <FiArrowLeft size={22} />
          </button>
          <Link to="/cardapio-admin" className="pedidos-admin-icon" title="Área de Cardápio">
            <MdRestaurantMenu size={22} />
          </Link>
          <button className="pedidos-admin-icon" onClick={logout}>
            <FiLogOut size={22} />
          </button>
        </div>
      </div>

      <div className="pedidos-admin-search">
        <input
          type="text"
          placeholder="Buscar por cliente ou prato..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {ordersError && (
        <MessageBox
          message={ordersError}
          type="error"
          onClose={() => {}}
        />
      )}

      <div className="pedidos-admin-content">
        {orderLoading ? (
          <p>Carregando pedidos...</p>
        ) : pedidosFiltrados.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <ul className="pedidos-list">
            {pedidosFiltrados.map((pedido) => (
              <li key={pedido._id} className="pedido-item">
                <div className="pedido-info-col">
                  <div className="pedido-info-row">
                    <div className="pedido-info-item">
                      <strong>Cliente:</strong> 
                      <span>{ pedido.userDetails?.[0]?.fullname || 'Desconhecido'}</span>
                    </div>
                    <div className="pedido-info-item">
                      <strong>Data:</strong> 
                      <span>{new Date(pedido.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="pedido-status-block">
                    <strong>Status:</strong>
                    <select
                      className="pedido-status-select"
                      value={pedido.pickupStatus}
                      onChange={(e) => handleStatusChange(pedido._id, e.target.value)}
                    >
                      <option value="Pending">Preparando</option>
                      <option value="Ready">Pronto para retirada</option>
                      <option value="Delivered">Entregue</option>
                      <option value="Cancelled">Cancelado</option>
                    </select>
                    <span className="pedido-status-text">
                      {statusMap[pedido.pickupStatus] || pedido.pickupStatus}
                    </span>
                  </div>
                  <div className="pedido-itens">
                    <strong>Itens:</strong>
                    <ul className="pedido-itens-list">
                      {pedido.orderItems?.map((item, idx) => (
                        <li key={idx}>
                          <span className="pedido-item-nome">{item.name}</span>
                          <span className="pedido-item-quantidade">x{item.quantidade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PedidosAdmin;