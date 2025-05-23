import React from "react";
import { Link } from 'react-router-dom'
import styles from './page.module.css'

export default Home;


function Home() {
  return (
    <div>
      <h1>Bem-vindo ao It's Tasty</h1>
      <br />
       {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
          <div>
            <h3 className="text-xl font-semibold mb-2">Acessível em Qualquer Tela</h3>
            <p className="text-gray-600">Compatível com celulares, tablets e computadores.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Experiência Moderna</h3>
            <p className="text-gray-600">Design profissional para você term uma melhor experiência.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-4 bg-orange-100">
        <h2 className="text-4xl font-bold mb-4">Quer fazer o seu pedido?</h2>
        <p className="text-lg text-gray-700 mb-6">Cadastre-se agora e crie sua conta! <Link to={'/auth'} className={styles.Link}>Entrar</Link></p>
        
      </section>
      
    </div>
  );
}