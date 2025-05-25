import { useState, useEffect, useRef } from "react"
import { TextField } from "@mui/material"
import styles from './page.module.css'
import authServices from "../../services/auth"
import { useNavigate } from "react-router-dom"
import { LuLogIn } from "react-icons/lu";


export default function Auth() {
    const [formType, setFormType] = useState('login')
    const [formData, setFormData] = useState(null)
    const { login, signup, authLoading } = authServices()
    const navigate = useNavigate()

    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if(authData) {
            if (authData.user.role === "admin") {
                navigate('/admin')
            }
            else {
                navigate('/user')
            }
             
        }
    }, [authData])

    // função para mudar o estado
    const handleChangeFormType = () => {
        setFormData(null)
        if(formType === 'login') {
            setFormType('signup')
        } else {
            setFormType('login')
        }
    }

    // função para mudar os dados
    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // função para enviar forms
    const handleSubmitForm = (e) => {
        e.preventDefault()
        
        switch (formType) {
            case 'login':
                login(formData)
                break
            case 'signup':
                if(formData.password !== formData.confirmPassword) {
                    console.log('Passwords do not match')
                    return
                }
                signup(formData)
            break
        }
    }

    if(authLoading) {
        return ( <h1>Loading...</h1> )
    }

    return (
        <div className={styles.authPageContainer}>
            {formType === 'login' ? (
                <>
                    <h1>Login</h1>
                    <button onClick={handleChangeFormType}>Você não tem uma conta? Clique aqui</button>
                    <form onSubmit={handleSubmitForm}>
                        <TextField 
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Password"
                        type="password"
                        name="password"
                        onChange={handleFormDataChange}
                        />
                        <button type="submit">Login<LuLogIn /></button>
                    </form>
                </>
            ) : null}

            {formType === 'signup' ? (
                <>
                    <h1>Signup</h1>
                    <button onClick={handleChangeFormType}>Você já tem uma conta? Clique aqui</button>
                    <form onSubmit={handleSubmitForm}>
                        <TextField 
                        required
                        label="Fullname"
                        type="fullname"
                        name="fullname"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Password"
                        type="password"
                        name="password"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Confirm password"
                        type="password"
                        name="confirmPassword"
                        onChange={handleFormDataChange}
                        />
                        <button type="submit">Signup<LuLogIn /></button>
                    </form>
                </>
            ) : null}
        </div>
    )
}