import { useState } from "react";


export default function authServices() {
    const [authLoading, setAuthLoading] = useState(false)
    const [error, setError] = useState("");
    const [success, setSucces] = useState("");

    const url = 'http://localhost:3000/auth'

    const login = (formData) => {
        setAuthLoading(true)
        
        // fazer requisições
        fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ token: result.body.token, user: result.body.user })
                )

            }
        })
        .catch((error) => {
            console.log(error)
            console.log(formData)
            alert("Erro ao realizar login")
            
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    const logout = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('carrinho')
    }

    const signup = (formData) => {
        setAuthLoading(true)
        
        fetch(`${url}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success && result.body.token) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ token: result.body.token, user: result.body.user })
                )
            }
        })
        .catch((error) => {
            console.log(error)
            alert("Erro se cadastrar")
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    return { signup, login, logout, authLoading }
}