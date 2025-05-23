import React, { useState } from "react";

function FazerLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("Login:", { email, senha });
  };

  return (
    <div className="container mt-5">
      <h2>Fazer Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default FazerLogin;
