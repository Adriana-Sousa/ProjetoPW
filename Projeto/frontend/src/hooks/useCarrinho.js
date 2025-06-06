import { useContext } from 'react';
import { CarrinhoContext } from '../context/carrinhoContext';

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro do CarrinhoProvider');
  }
  return context;
}
