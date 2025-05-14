import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopBarProps {
  children?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {children}
          <div className="hidden md:flex relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Nome do usuário (apenas desktop) */}
          <span className="hidden md:inline text-sm font-medium">
            {user?.name}
          </span>

          {/* Avatar do usuário */}
          <div className="relative">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user?.avatar || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={user?.name || 'Usuário'}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
