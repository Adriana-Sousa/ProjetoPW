import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import das pages
import Home from './pages/home/page.jsx'
import Profile from './pages/profile/page.jsx'
import Auth from './pages/auth/page.jsx'
import UserHome from './pages/client/page.jsx'
import AdminHome from './pages/admin/page.jsx'
import Pedidos from './pages/admin/pedidos/page.jsx'
import PlatesAdmin from './pages/admin/plates/plates.jsx'
import AddPlates from './pages/admin/plates/addPlates.jsx'
import PlatesUsers from './pages/client/plates/page.jsx'
import VerUsers from './pages/admin/users/users.jsx'
import OrdersUsers from './pages/client/orders/orders.jsx'
import CartUsers from './pages/client/cart/page.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import Notfound from './pages/notFound.jsx'

const pages = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Auth /> },
            { path: '/home', element: <Home /> },
            { path: '/profile', element: <Profile /> },
            { path: '/auth', element: <Auth /> },
            { path: '/user', element: <UserHome /> },
            { path: '/user/meus-pedidos', element: <OrdersUsers /> },
            { path: '/user/plates', element: <PlatesUsers /> },
            { path: '/user/carts', element: <CartUsers /> },
            { path: '/admin', element: <AdminHome /> },
            { path: '/admin/pedidos', element: <Pedidos /> },
            { path: '/admin/pratos', element: <PlatesAdmin /> },
            { path: '/admin/pratos/add', element: <AddPlates /> },
            { path: '/admin/users', element: <VerUsers /> },
            { path: '/*', element: <Notfound /> },
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={pages}></RouterProvider>
  </React.StrictMode>,
)