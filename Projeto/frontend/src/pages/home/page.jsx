//import Dessert from '../../../public/imgs/homepage/dessert'
//import NaturalFood from '../../../public/imgs/homepage/naturalFood'
//import Vegetable from '../../../public/imgs/homepage/vegetable'
//import { FaMapMarkerAlt, FaFacebookSquare, FaInstagram, FaWhatsapp } from "react-icons/fa"
import React from "react";
export default Home;
import Login from "../pages/login/page.jsx";
import Cadastro from "../pages/cadastro/page.jsx";

function Home() {
  return (
    <div>
      <h1>Bem-vindo à Home</h1>
      <Login />
      <Cadastro />
      <p>Esta é a página inicial do sistema.</p>
    </div>
  );
}
