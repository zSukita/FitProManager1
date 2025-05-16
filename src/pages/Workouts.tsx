import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Dumbbell, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWorkouts, deleteWorkout } from '../services/supabaseService';
import { Workout } from '../types';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!user?.id) { // Check if user and user.id exist
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedWorkouts = await fetchWorkouts(user.id); // Pass user.id
        setWorkouts(fetchedWorkouts);
      } catch (err) {
        console.error('Error loading workouts:', err);
        setError('Erro ao carregar a lista de treinos.');
        toast.error('Erro ao carregar treinos.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [user?.id]); // Add user.id to dependency array

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.')) {
      try {
        await deleteWorkout(workoutId);
        setWorkouts(workouts.filter(workout => workout.id !== workoutId));
        toast.success('Treino excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting workout:', error);
        toast.error('Erro ao excluir treino.');
      }
    }
  };


  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'todos' || workout.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Treinos</h1>
          <p className="text-gray-600">Gerencie seus modelos de treino</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/workouts/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Treino
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
           <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="input-field pl-10"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="todos">Todos os Tipos</option>
            <option value="força">Força</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="resistência">Resistência</option>
            <option value="cardio">Cardio</option>
            <option value="flexibilidade">Flexibilidade</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
      </div>

      {/* Lista de Treinos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando treinos...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum treino encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map(workout => (
              <div
                key={workout.id}
                className="client-card border border-gray-200 rounded-lg p-4 flex flex-col space-y-3 cursor-pointer"
                onClick={() => navigate(`/dashboard/workouts/${workout.id}`)}
              >
                 <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900 truncate">{workout.name}</h3>
                     <div className="flex-shrink-0 flex items-center space-x-1">
                       {/* Botão de exclusão - Adicionado para funcionalidade básica */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleDeleteWorkout(workout.id);
                          }}
                          className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Excluir treino"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                 </div>
                <p className="text-sm text-gray-600 line-clamp-2">{workout.description || 'Sem descrição'}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Dumbbell size={16} className="mr-1 text-gray-400" />
                  <span>{workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>
                </div>
                 <div className="flex flex-wrap gap-1 mt-2">
                    {workout.target_muscle_groups && workout.target_muscle_groups.map((group, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {group}
                      </span>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
