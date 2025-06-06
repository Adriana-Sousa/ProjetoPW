import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar'; 

const Layout = ({ children }) => {
  const location = useLocation();
  
  // rotas sem navbar
  const noNavbarRoutes = ['/', '/login', '/cadastro', '/admin', '/loginadm', '/cardapio-user', '/cart', '/cardapio-publico', '/cardapio-admin', '/user-page', '/logout'];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
