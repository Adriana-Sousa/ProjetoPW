import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/layout';
import Footer from './components/footer/footer.jsx';
import Home from './pages/home/home.jsx';
import Carrinho from './pages/cart/cart.jsx';
import Cardapio from './pages/cardapio/cardapio.jsx';
import Login from './pages/login/login.jsx';
import Cadastro from './pages/cadastro/cadastro.jsx';
import Admin from './pages/admin/admin.jsx';
import LoginAdm from './pages/loginadm/loginadm.jsx';
import CardapioPublico from './pages/cardapio/cardapioPublico.jsx';
import Notfound from './pages/notFound.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRole="client">
              <Carrinho />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cardapio"
          element={
            <ProtectedRoute allowedRole="client">
              <Cardapio />
            </ProtectedRoute>
          }
        />
        <Route path="/cardapio-publico" element={<CardapioPublico />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/loginadm" element={<LoginAdm />} />
        <Route path="/sem-autorizacao" element={<Unauthorized />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
      <Footer />
    </Layout>
  );
}

export default App;

