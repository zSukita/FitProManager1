import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import TopBar from '../components/navigation/TopBar';
import { Menu } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar>
          <button
            className="p-2 rounded-md lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
        </TopBar>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay para fechar o sidebar em dispositivos móveis */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
