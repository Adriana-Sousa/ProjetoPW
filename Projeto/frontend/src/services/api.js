import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Permite o envio de cookies e credenciais            
  // headers: {
  //   'Authorization': `Bearer ${localStorage.getItem('auth')?.token}`
  // }  
})

export default api;
