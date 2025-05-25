import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authServices from "../../services/auth"
import orderServices from "../../services/order"
import styles from './page.module.css'
import { LuLogOut, LuTimer, LuCircleAlert, LuCheck } from "react-icons/lu"
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

    console.log(ordersList)

    return (
        <div className={styles.pageContainer}>
              {
                autenticado? <div> <div>
                <h1>{authData?.user?.fullname}</h1>
                <h3>{authData?.user?.email}</h3>
            </div>

            <button onClick={handleLogout}>Logout<LuLogOut /></button> </div>

              : <Auth /> 
              }
               
            </div>
       
    )
}