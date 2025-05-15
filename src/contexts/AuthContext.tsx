import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase'; // Importa o cliente Supabase
import toast from 'react-hot-toast'; // Importa toast para notificações

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Mapear o usuário do Supabase para o tipo User do seu projeto
        const supabaseUser = session.user;
        const appUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email || 'Usuário', // Use metadata ou email
          email: supabaseUser.email!,
          role: supabaseUser.user_metadata?.role || 'trainer', // Defina um padrão ou obtenha da metadata
          avatar: supabaseUser.user_metadata?.avatar || undefined,
          planId: supabaseUser.user_metadata?.planId || 'free' // Defina um padrão ou obtenha da metadata
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // onAuthStateChange cuidará de definir o usuário
      toast.success('Login realizado com sucesso!');

    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao fazer login: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // onAuthStateChange cuidará de definir o usuário como null
      toast.success('Logout realizado com sucesso!');

    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao fazer logout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
