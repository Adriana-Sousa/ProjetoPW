import React from 'react';

function CardProduto({ nome, descricao, preco }) {
  return (
    <div className="card-produto">
      <h2>{nome}</h2>
      <p>{descricao}</p>
      <p>R$ {preco}</p>
      <button>Adicionar ao Carrinho</button>
    </div>
  );
}

export default CardProduto;


