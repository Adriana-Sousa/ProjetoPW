import React from "react";
import { Link } from 'react-router-dom'
import styles from './page.module.css'

export default Home;


function Home() {
  return (
    <div>
      <h1>Bem-vindo à Home</h1>
      <br />
      <p>Um cardápio online, simples para usar, veja as nossas opções de pratos. <Link to={'/auth'} className={styles.Link}>Entrar</Link></p>
    </div>
  );
}