import React from "react";
import "./cart/page.module.css";

const Carrinho = () => {
  // exemplo produtos p testar
  const produtos = [
    {
      id: 1,
      nome: "Pizza Calabresa",
      descricao: "Com queijo, cebola e molho especial.",
      preco: 45.0,
    },
    {
      id: 2,
      nome: "Hambúrguer Artesanal",
      descricao: "Pão brioche, carne Angus e molho da casa.",
      preco: 25.0,
    },
    {
      id: 3,
      nome: "Batata Frita",
      descricao: "Porção média de batatas crocantes.",
      preco: 15.0,
    },
  ];

  const handleRemover = (id) => {
    //  remover itens
    console.log(`Remover produto com id: ${id}`);
  };

  const total = produtos.reduce((acc, item) => acc + item.preco, 0);

  return (
    <div className="container-carrinho">
      {/* LOGO */}
      <header className="header-carrinho">
        <h1>Seu Carrinho</h1>
      </header>

      <main className="produtos-carrinho">
        {produtos.map((produto) => (
          <div key={produto.id} className="item-produto">
            <h2>{produto.nome}</h2>

            {/* descrições */}
            <p className="descricao-produto">{produto.descricao}</p>

            <p className="preco-produto">
              Preço: R$ {produto.preco.toFixed(2)}
            </p>

            <button
              className="btn-remover"
              onClick={() => handleRemover(produto.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </main>

      <footer className="footer-carrinho">
        <h3>Total: R$ {total.toFixed(2)}</h3>

        {/* botão do pagamento */}
        <button className="btn-finalizar">Finalizar Compra</button>
      </footer>
    </div>
  );
};

export default Carrinho;
