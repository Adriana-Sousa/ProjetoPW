import styles from './navbar.module.css'
//import { LuShoppingCart, LuUserCircle, LuMenu } from "react-icons/lu"
import { Drawer } from '@mui/material'
import { useState } from 'react'

 function Navbar() {
    const [openMenu, setOpenMenu] = useState(false)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return (
        <h1>Navbar</h1>
    )
}

export default Navbar