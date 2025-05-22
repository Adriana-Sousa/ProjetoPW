import Navbar from './components/navbar/navbar'
import { useState } from 'react'
//import Navbar from './components/navbar/navbar.jsx'


function App() {
  const [count, setCount] = useState(0)

  	return (
		<>
			<Navbar />
   		 	<div><h1>Cardápio online</h1></div>
		
		</>
	)
}

export default App