import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Lock, Loader, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext'; // Importa o hook useAuth

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signUp, loading, error } = useAuth(); // Usa o hook useAuth
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    // Validação básica de senha (mínimo 8 caracteres, 1 maiúscula, 1 número)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um número.');
      return;
    }

    try {
      // Chama a função signUp do contexto de autenticação
      await signUp(formData.email, formData.password, formData.name);
      // Se o cadastro for bem-sucedido (e email confirmation estiver desabilitado),
      // o usuário será redirecionado automaticamente pelo AuthContext.
      // Se a confirmação estiver ativa, o usuário permanecerá nesta página
      // e verá a mensagem de toast para confirmar o email.
      // Podemos adicionar um redirecionamento explícito para login aqui
      // se a confirmação de email estiver desabilitada no Supabase.
       navigate('/auth/login');

    } catch (err) {
      // O erro já é tratado e exibido pelo toast no AuthContext
      console.error("Erro no cadastro:", err); // Log para debug
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-2xl font-bold mb-6">Crie sua conta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="label">
            Nome completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
        </div>

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
              value={formData.email}
              onChange={handleChange}
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
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mínimo de 8 caracteres, incluindo uma letra maiúscula e um número
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirme a senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field pl-10"
            />
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
                Processando...
              </>
            ) : (
              'Criar conta'
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
        <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
};

export default Register;
