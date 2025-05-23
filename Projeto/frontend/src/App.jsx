import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import { useState } from 'react'
import { Outlet } from "react-router-dom"


function App() {

  	return (
		<>
			<Navbar />
			<Outlet />
		
		</>
	)
}

export default App