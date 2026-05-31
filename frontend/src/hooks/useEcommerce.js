import { useContext } from 'react';
import { EcommerceContext } from '../context/EcommerceContext.jsx';

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce deve ser usado dentro de EcommerceProvider');
  }
  return context;
}
