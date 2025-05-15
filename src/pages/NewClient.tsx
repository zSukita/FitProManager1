import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient, getCurrentUser } from '../services/supabaseService'; // Import Supabase service

const NewClient: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'masculino',
    goal: '',
    status: 'ativo',
    medical_history: '', // Match database column name
    notes: '',
    avatar_url: '', // Add avatar_url field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      // Prepare data for insertion, converting age to number
      const clientDataToSave = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null, // Convert age to number, handle empty string
        // start_date will default in DB
        // measurements, workout_ids, plan_id can be added later if needed in the form
      };

      await createClient(clientDataToSave, user.id);

      toast.success('Cliente cadastrado com sucesso!');
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Erro ao cadastrar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/clients')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Novo Cliente</h1>
          <p className="text-gray-600">Cadastre um novo cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="label">Nome completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              // email is not required in DB, but maybe required in UI? Let's keep it required for now.
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="label">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              // phone is not required in DB, let's make it optional in UI too
            />
          </div>

          <div>
            <label htmlFor="age" className="label">Idade</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input-field"
              // age is not required in DB, let's make it optional in UI too
            />
          </div>

          <div>
            <label htmlFor="gender" className="label">Gênero</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>

           <div>
            <label htmlFor="avatar_url" className="label">URL do Avatar</label>
            <input
              type="text"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="goal" className="label">Objetivo</label>
          <textarea
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="input-field"
            rows={3}
            // goal is not required in DB, let's make it optional in UI too
          />
        </div>

        <div className="mt-6">
          <label htmlFor="medical_history" className="label">Histórico Médico</label> {/* Match database column name */}
          <textarea
            id="medical_history"
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            className="input-field"
            rows={3}
          />
        </div>

        <div className="mt-6">
          <label htmlFor="notes" className="label">Observações</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            rows={3}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewClient;
