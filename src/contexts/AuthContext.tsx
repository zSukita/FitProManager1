import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: () => { },
  loading: true, // Mantém loading inicial como true
  error: null,
  signUp: async () => { },
});

// Hook para utilizar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provider do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Mantém loading inicial como true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função assíncrona para buscar a sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Mapear o usuário do Supabase para o tipo User do seu projeto
          const supabaseUser = session.user;
          const appUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email || 'Usuário',
            email: supabaseUser.email!,
            role: supabaseUser.user_metadata?.role || 'trainer',
            avatar: supabaseUser.user_metadata?.avatar || undefined,
            planId: supabaseUser.user_metadata?.planId || 'free'
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao obter sessão inicial:", err);
        setUser(null); // Garante que o usuário seja null em caso de erro
      } finally {
        setLoading(false); // Define loading como false APÓS a verificação inicial
      }
    };

    getInitialSession(); // Chama a função imediatamente ao montar

    // Configura o listener para mudanças de estado subsequentes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session); // Log para depuração
      if (session) {
        const supabaseUser = session.user;
        const appUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email || 'Usuário',
          email: supabaseUser.email!,
          role: supabaseUser.user_metadata?.role || 'trainer',
          avatar: supabaseUser.user_metadata?.avatar || undefined,
          planId: supabaseUser.user_metadata?.planId || 'free'
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      // Não precisa definir loading(false) aqui, pois já foi feito após a verificação inicial
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Array de dependência vazio garante que roda apenas uma vez ao montar

  // Função de login
  const login = async (email: string, password: string) => {
    setLoading(true); // Define loading true durante a tentativa de login
    setError(null);
    try {
      console.log('Tentando fazer login com:', { email, password });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Supabase login error:', error);
        toast.error(`Erro ao fazer login: ${error.message}`);
        throw error;
      }
      // onAuthStateChange cuidará de definir o estado do usuário
      toast.success('Login realizado com sucesso!');
      // A navegação para '/' é tratada pelo componente que chama login, não aqui
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      toast.error(`Erro ao fazer login: ${err.message}`);
      throw err; // Re-lança o erro
    } finally {
      setLoading(false); // Define loading false após a tentativa de login
    }
  };

  // Função de cadastro
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true); // Define loading true durante a tentativa de cadastro
    setError(null);
    try {
      console.log('Tentando cadastrar com:', { email, password, name });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'trainer',
            planId: 'free',
          }
        }
      });
      if (error) {
        console.error('Supabase signup error:', error);
        toast.error(`Erro ao cadastrar: ${error.message}`);
        throw error;
      }
      if (data.user) {
        toast.success('Conta criada com sucesso! Por favor, faça login.');
      } else if (data.session === null) {
        toast('Confirme seu email para ativar a conta.', { icon: '📧' });
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message);
      toast.error(`Erro ao cadastrar: ${err.message}`);
      throw err;
    } finally {
      setLoading(false); // Define loading false após a tentativa de cadastro
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true); // Define loading true durante a tentativa de logout
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
        toast.error(`Erro ao fazer logout: ${error.message}`);
        throw error;
      }
      // onAuthStateChange cuidará de definir o estado do usuário como null
      toast.success('Logout realizado com sucesso!');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
      toast.error(`Erro ao fazer logout: ${err.message}`);
    } finally {
      setLoading(false); // Define loading false após a tentativa de logout
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
