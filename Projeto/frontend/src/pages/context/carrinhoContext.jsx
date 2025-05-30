import { createContext, useContext } from 'react';

export const CarrinhoContext = createContext();

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro do CarrinhoProvider');
  }
  return context;
}
