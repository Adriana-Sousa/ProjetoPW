import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import { useState } from 'react'
import { Outlet } from "react-router-dom"
import { CartProvider } from './contexts/useCartContext'


function App() {

  	return (
		<>
			<CartProvider>
				<Navbar />
					<Outlet />
			</CartProvider>
		</>
	)
}

export default App