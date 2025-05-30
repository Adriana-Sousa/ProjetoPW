import React, { useState, useEffect } from 'react';
import { CarrinhoContext } from './carrinhoContext';

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoStorage = localStorage.getItem('carrinho');
    return carrinhoStorage ? JSON.parse(carrinhoStorage) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

// adicionar, remover, etc...

  function adicionarAoCarrinho(prato) {
    setCarrinho(prev => {
      const existe = prev.find(item => item._id === prato._id);
      if (existe) {
        return prev.map(item =>
          item._id === prato._id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prev, { ...prato, quantidade: 1 }];
      }
    });
  }

  function removerItem(id) {
    setCarrinho(prev => prev.filter(item => item._id !== id));
  }

  function incrementarQuantidade(id) {
    setCarrinho(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  }

  function decrementarQuantidade(id) {
    setCarrinho(prev =>
      prev
        .map(item =>
          item._id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter(item => item.quantidade > 0)
    );
  }
  
  function limparCarrinho() {
    setCarrinho([]);
  }

  const total = carrinho.reduce(
    (acc, item) => acc + item.price * item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerItem,
        incrementarQuantidade,
        decrementarQuantidade,
        limparCarrinho,
        total,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}
