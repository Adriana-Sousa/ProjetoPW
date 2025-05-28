import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authServices from "../../services/auth"
import orderServices from "../../services/order"
import styles from './page.module.css'
import { LuLogOut } from "react-icons/lu"
import { Link } from "react-router-dom"
import Loading from "../loading/page"
import { adminRole, autenticado } from "../../contexts/authContext"
import Auth from "../auth/page"

export default function Profile() {
    const { logout } = authServices()
    const { getUserOrders, orderLoading, refetchOrders, ordersList } = orderServices()
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if(!authData) {
             navigate('/auth')
        } else if(refetchOrders) {
            getUserOrders(authData?.user?._id)
        }
    }, [authData, refetchOrders])



    const handleLogout = () => {
        logout()
        alert("Logout realizado.")
        return navigate('/')
    }

    //console.log(ordersList)

    return (
    <section className={styles.profileContainer}>
      {autenticado ? (
        <div className={styles.profileContent}>
          <header className={styles.profileHeader}>
            <h1 className={styles.profileTitle}>{authData?.user?.fullname}</h1>
            <p className={styles.profileEmail}>{authData?.user?.email}</p>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Sair da conta"
            >
              <LuLogOut /> Sair
            </button>
          </header>
          <Link to="/home" className={styles.backButton}>
            Voltar para a página inicial
          </Link>
        </div>
      ) : (
        <Auth />
      )}
    </section>
  );
}