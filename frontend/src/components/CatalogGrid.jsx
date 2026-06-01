import React, { useMemo } from 'react';
import { useEcommerce } from '../hooks/useEcommerce.js';
import { ProductCard } from './ProductCard.jsx';

export function CatalogGrid() {
  const { catalogo, searchQuery } = useEcommerce();

  const filteredCatalogo = useMemo(() => {
    if (!searchQuery) return catalogo;

    const query = searchQuery.toLowerCase();
    return catalogo.filter(livro =>
      livro.titulo.toLowerCase().includes(query) ||
      livro.autor.toLowerCase().includes(query)
    );
  }, [catalogo, searchQuery]);

  return (
    <section id="catalog" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-brown-dark mb-8">Nosso Catálogo</h2>

        {filteredCatalogo.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brown-light text-lg">
              {searchQuery
                ? `Nenhum livro encontrado para "${searchQuery}"`
                : 'Catálogo vazio'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalogo.map(livro => (
              <ProductCard key={livro.id} livro={livro} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
