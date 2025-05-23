import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authServices from "../../services/auth"
import styles from './page.module.css'
import { LuLogOut } from "react-icons/lu"
import { Link } from "react-router-dom"


export default function Profile() {
    const { logout } = authServices()
    
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))

     useEffect(() => {
        if(!authData) {
            navigate('/auth')
        } 
    }, [authData])

    const handleLogout = () => {
        logout()
        return navigate('/')
    }

    

    return (
        <div className={styles.pageContainer}>
            <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout<LuLogOut /></button>

            
        </div>
    )
}