import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ChevronDown, Copy, Share, Trash2, MoveRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchWorkouts, deleteWorkout, getCurrentUser } from '../services/supabaseService'; // Import Supabase services
import { Workout } from '../types'; // Import Workout type

const Workouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterMuscle, setFilterMuscle] = useState('todos');
  const [workouts, setWorkouts] = useState<Workout[]>([]); // Use state for workouts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // State for current user

  // Fetch workouts on component mount and when currentUser changes
  useEffect(() => {
    const loadUserAndWorkouts = async () => {
      setLoading(true);
      setError(null);
      const user = await getCurrentUser();
      setCurrentUser(user);

      if (user) {
        try {
          const fetchedWorkouts = await fetchWorkouts(user.id);
          setWorkouts(fetchedWorkouts);
        } catch (err) {
          console.error('Failed to fetch workouts:', err);
          setError('Erro ao carregar treinos.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Usuário não autenticado.'); // Handle unauthenticated state
      }
    };

    loadUserAndWorkouts();
  }, []); // Dependency array includes currentUser to refetch if user state changes (e.g., after login)

  // Filtrar treinos
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'todos' || workout.type === filterType;
    const matchesMuscle = filterMuscle === 'todos' || workout.target_muscle_groups.includes(filterMuscle); // Use target_muscle_groups from DB

    return matchesSearch && matchesType && matchesMuscle;
  });

  // Manipuladores de eventos
  const handleCopyWorkout = (id: string) => {
    toast.success('Treino duplicado com sucesso!');
    // TODO: Implementar lógica de duplicação real (fetch workout by id, create new with same data)
  };

  const handleShareWorkout = (id: string) => {
    // TODO: Implementar lógica de compartilhamento real (ex: copiar link)
    toast.success('Link do treino copiado para a área de transferência!');
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este treino?')) {
      return;
    }

    try {
      await deleteWorkout(id);
      // Remove the deleted workout from the state
      setWorkouts(workouts.filter(workout => workout.id !== id));
      toast.success('Treino excluído com sucesso!');
    } catch (err) {
      console.error('Failed to delete workout:', err);
      toast.error('Erro ao excluir treino.');
    }
  };

  // Cores para os tipos de treino
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'força':
        return 'bg-blue-100 text-blue-800';
      case 'hipertrofia':
        return 'bg-purple-100 text-purple-800';
      case 'resistência':
        return 'bg-orange-100 text-orange-800';
      case 'cardio':
        return 'bg-green-100 text-green-800';
      case 'flexibilidade':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error}</p>
        {/* Optionally add a retry button */}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Treinos</h1>
          <p className="text-gray-600">Crie e gerencie treinos personalizados</p>
        </div>
        {/* Link para a página de criação de treino */}
        <Link
          to="/workouts/new"
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          Novo Treino
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm w-full appearance-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              <option value="força">Força</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="resistência">Resistência</option>
              <option value="cardio">Cardio</option>
              <option value="flexibilidade">Flexibilidade</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm w-full appearance-none cursor-pointer"
              value={filterMuscle}
              onChange={(e) => setFilterMuscle(e.target.value)}
            >
              <option value="todos">Todos os grupos musculares</option>
              <option value="peito">Peito</option>
              <option value="costas">Costas</option>
              <option value="ombros">Ombros</option>
              <option value="bíceps">Bíceps</option>
              <option value="tríceps">Tríceps</option>
              <option value="pernas">Pernas</option>
              <option value="glúteos">Glúteos</option>
              <option value="abdômen">Abdômen</option>
              <option value="core">Core</option>
              <option value="total">Total</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de treinos */}
      {filteredWorkouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Nenhum treino encontrado com os filtros aplicados.</p>
          <button
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setSearchTerm('');
              setFilterType('todos');
              setFilterMuscle('todos');
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-sm hover:shadow transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(workout.type)}`}>
                    {workout.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {workout.description || 'Sem descrição'}
                </p>

                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Grupos musculares</h4>
                  <div className="flex flex-wrap gap-1">
                    {workout.target_muscle_groups.map((group, idx) => ( // Use target_muscle_groups
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Exercícios</h4>
                  <div className="space-y-2">
                    {workout.exercises.slice(0, 3).map((exerciseItem, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs mr-2">
                          {idx + 1}
                        </span>
                        <span className="truncate">{exerciseItem.exercise.name}</span>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-primary font-medium flex items-center mt-1">
                        + {workout.exercises.length - 3} exercícios
                        <MoveRight size={14} className="ml-1" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopyWorkout(workout.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      title="Duplicar treino"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleShareWorkout(workout.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      title="Compartilhar treino"
                    >
                      <Share size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
                      title="Excluir treino"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {/* Link para a rota correta de detalhes do treino */}
                  <Link
                    to={`/workouts/${workout.id}`}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
