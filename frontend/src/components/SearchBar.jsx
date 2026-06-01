import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';

export function SearchBar() {
  const { setSearchQuery } = useEcommerce();
  const [input, setInput] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      setSearchQuery(input);
    }, 300);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [input, setSearchQuery]);

  return (
    <div className="flex-1 max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar livros, autores..."
        className="w-full px-4 py-2 border border-beige-200 rounded-md focus:outline-none focus:border-brown-base focus:ring-2 focus:ring-brown-base focus:ring-opacity-10"
      />
    </div>
  );
}
