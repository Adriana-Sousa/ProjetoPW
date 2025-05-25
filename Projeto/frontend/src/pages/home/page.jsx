//import React from "react";
//import { Link } from 'react-router-dom'
import styles from './page.module.css'
import Auth from "../auth/page";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserHome from "../client/page";
import AdminHome from '../admin/page';

export default Home;


function Home() {
  const navigate = useNavigate()
  
      const authData = JSON.parse(localStorage.getItem('auth'))
  
      const data = authData? true : false
      const adminRole = authData?.user?.role === "admin" ? true: false
  return (
    <div>
      {
        data?  adminRole? <AdminHome /> : <UserHome /> : <Auth /> 
      }
       
    </div>
  );
}