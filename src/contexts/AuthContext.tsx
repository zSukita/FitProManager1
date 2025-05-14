import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';

// Dados mockados
const MOCK_USER: User = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos@example.com',
  role: 'trainer',
  avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  plan: 'profissional'
};

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null
});

// Hook para utilizar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provider do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se há um usuário autenticado ao carregar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem('fitpromanager_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular uma requisição de login (em produção seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciais (simulado)
      if (email === 'demo@fitpromanager.com' && password === 'demo123') {
        setUser(MOCK_USER);
        localStorage.setItem('fitpromanager_user', JSON.stringify(MOCK_USER));
      } else {
        throw new Error('Email ou senha inválidos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitpromanager_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
