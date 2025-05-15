import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  Dumbbell,
  BarChart3,
  X,
  LogOut,
  Settings,
  // Removed BookOpen import
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Treinos', href: '/workouts', icon: Dumbbell },
    { name: 'Finanças', href: '/finances', icon: BarChart3 },
    // Removed Exercise Library link
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">FitProManager</span>
        </div>
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Informações do usuário */}
      <div className="flex items-center px-4 py-4 border-b">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={user?.avatar || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={user?.name || 'Usuário'}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{user?.name || 'Usuário'}</p>
          <p className="text-xs text-gray-500">
            Plano {user?.plan.charAt(0).toUpperCase() + user?.plan.slice(1)}
          </p>
        </div>
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose} // Fechar sidebar em mobile ao clicar
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Links do rodapé */}
      <div className="px-2 py-4 border-t">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
          onClick={onClose} // Fechar sidebar em mobile ao clicar
        >
          <Settings size={20} />
          Configurações
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 text-gray-600 hover:text-red-500 px-4 py-3 hover:bg-red-50 rounded-md transition-all"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
