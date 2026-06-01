import React from 'react';

export function HeroSection() {
  const handleExplore = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-brown-base text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
          Descubra Novos Mundos
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Explore nossa coleção curada de livros selecionados com cuidado
        </p>
        <button
          onClick={handleExplore}
          className="btn-primary bg-white text-brown-base hover:bg-beige-50"
        >
          Explorar Catálogo
        </button>
      </div>
    </section>
  );
}
