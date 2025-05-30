import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/layout';
//import Header from './components/header/header.jsx';
import Footer from './components/footer/footer.jsx';
import Home from './pages/home/home.jsx';
import Carrinho from './pages/cart/cart.jsx';
import Cardapio from './pages/cardapio/cardapio.jsx';
import Login from './pages/login/login.jsx';
import Cadastro from './pages/cadastro/cadastro.jsx';
import Admin from './pages/admin/admin.jsx';
import LoginAdm from './pages/loginadm/loginadm.jsx';
import CardapioPublico from './pages/cardapio/cardapioPublico.jsx';

function App() {
  return (
  <Router>
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Carrinho />} />
      <Route path="/cardapio" element={<Cardapio />} />
      <Route path="/cardapio-publico" element={<CardapioPublico />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/cadastro" element={<Cadastro/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/loginadm" element={<LoginAdm/>}/>
    </Routes>
    <Footer />
  </Layout>
</Router>
)
}

export default App
