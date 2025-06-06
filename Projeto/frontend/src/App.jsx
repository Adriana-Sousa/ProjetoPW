import { Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/layout';
//import Header from './components/header/header.jsx';
import Footer from './components/footer/footer.jsx';
import Home from './pages/home/home.jsx';
import Carrinho from './pages/cart/cart.jsx';
import CardapioUsuario from './pages/cardapio/cardapioUser.jsx';
import Login from './pages/login/login.jsx';
import Cadastro from './pages/cadastro/cadastro.jsx';
import Admin from './pages/admin/admin.jsx';
import UserPage from './pages/profileUser/userPage.jsx';
import LoginAdm from './pages/loginadm/loginadm.jsx';
import CardapioPublico from './pages/cardapio/cardapioPublico.jsx';
import Notfound from './pages/notFound.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import CardapioAdmin from './pages/cardapio/cardapioAdmin.jsx';
import Logout from './pages/logout/logout.jsx';

function App() {
  return (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/cart" element={<Carrinho />} />
      <Route path="/cardapio-user" element={<CardapioUsuario />} />
      <Route path="/cardapio-publico" element={<CardapioPublico />} />
      <Route path="/cardapio-admin" element={<ProtectedRoute allowedRole="admin"><CardapioAdmin /></ProtectedRoute>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/cadastro" element={<Cadastro/>}/>
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Admin /></ProtectedRoute>} />
      <Route path="/user-page" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
      <Route path="/loginadm" element={<LoginAdm/>}/>
      <Route path="/sem-autorizacao" element={<Unauthorized />} />
      <Route path="/*" element={<Notfound />} />
    </Routes>
    <Footer />
  </Layout>
)
}

export default App
