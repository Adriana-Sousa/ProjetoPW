import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar'; 

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Rotas que NÃO devem exibir a Navbar
  const noNavbarRoutes = ['/', '/login', '/cadastro', '/admin', '/loginadm', '/cardapio', '/cart'];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
