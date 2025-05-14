import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/" className="mt-8 btn-primary flex items-center gap-2">
        <ArrowLeft size={18} />
        Voltar para o Dashboard
      </Link>
    </div>
  );
};

export default PageNotFound;
