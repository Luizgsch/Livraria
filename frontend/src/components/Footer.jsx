import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-beige-50 border-t border-beige-200 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-brown-light text-sm">
          © {currentYear} Livraria POO. Todos os direitos reservados.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            Sobre
          </a>
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            Contato
          </a>
          <a href="#" className="text-brown-base hover:text-brown-dark text-sm">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
