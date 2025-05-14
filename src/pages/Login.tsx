import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@fitpromanager.com');
  const [password, setPassword] = useState('demo123');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err) {
      toast.error(error || 'Falha ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-2xl font-bold mb-6">Entre na sua conta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-primary hover:text-primary/80">
            Cadastre-se
          </Link>
        </p>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Credenciais de demonstração:</p>
          <p>Email: demo@fitpromanager.com</p>
          <p>Senha: demo123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
