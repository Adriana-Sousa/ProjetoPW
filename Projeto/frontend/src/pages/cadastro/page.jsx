import { useState } from "react";
import axios from "axios";
import "./cadastro/page.module.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/cadastrar", {
        nome,
        email,
        senha,
      });
      setMensagem("Cadastro realizado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      setMensagem("Erro ao cadastrar: " + error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      <p>{mensagem}</p>
    </div>
  );
}

export default Cadastro;
