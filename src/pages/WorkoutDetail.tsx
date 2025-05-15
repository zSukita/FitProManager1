import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workouts } from '../data/mockData';
import { Workout, WorkoutExercise } from '../types';
import { ArrowLeft, Dumbbell, Timer } from 'lucide-react';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | undefined>(undefined);

  useEffect(() => {
    // Encontrar o treino pelo ID nos dados mock
    const foundWorkout = workouts.find(w => w.id === id);
    setWorkout(foundWorkout);
  }, [id]);

  if (!workout) {
    return (
      <div className="animate-fade-in text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Treino não encontrado</h1>
        <p className="text-gray-600 mt-2">O treino com o ID "{id}" não foi encontrado.</p>
        <button
          onClick={() => navigate('/treinos')}
          className="mt-6 btn-primary"
        >
          Voltar para a lista de treinos
        </button>
      </div>
    );
  }

  // Cores para os tipos de treino (duplicado do Workouts.tsx por enquanto)
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


  return (
    <div className="animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/treinos')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
          <p className="text-gray-600">{workout.description || 'Sem descrição'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Informações Gerais</h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Tipo:</strong> <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(workout.type)}`}>{workout.type}</span></p>
              <p><strong>Criado em:</strong> {new Date(workout.created).toLocaleDateString('pt-BR')}</p>
              <p><strong>Grupos Musculares Alvo:</strong> {workout.targetMuscleGroups.join(', ') || 'Não especificado'}</p>
            </div>
          </div>
          <div>
             <h2 className="text-lg font-semibold mb-3">Observações</h2>
             <p className="text-gray-700 text-sm">{workout.notes || 'Nenhuma observação.'}</p>
          </div>
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Exercícios ({workout.exercises.length})</h2>

        {workout.exercises.length === 0 ? (
           <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Dumbbell className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Nenhum exercício adicionado a este treino.</p>
           </div>
        ) : (
          <div className="space-y-6">
            {workout.exercises.map((item, exerciseIndex) => (
              <div key={exerciseIndex} className="border rounded-lg overflow-hidden">
                 <div className="bg-gray-50 p-4 flex items-start gap-4 border-b">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="text-lg font-semibold">{exerciseIndex + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.exercise.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {item.exercise.muscleGroup}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {item.exercise.equipment}
                        </span>
                      </div>
                    </div>
                 </div>

                 <div className="p-4">
                    <p className="text-sm text-gray-700 mb-4">{item.exercise.description}</p>

                    {item.exercise.imageUrl && (
                      <img
                        src={item.exercise.imageUrl}
                        alt={item.exercise.name}
                        className="mb-4 rounded-lg w-full max-w-xs h-auto object-cover"
                      />
                    )}

                    <h4 className="text-sm font-medium text-gray-600 mb-2">Séries:</h4>
                    <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500">
                      <div className="col-span-1">#</div>
                      <div className="col-span-4">Repetições</div>
                      <div className="col-span-3">Carga (kg)</div>
                      <div className="col-span-4">Descanso (s)</div>
                    </div>

                    {item.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-12 gap-2 mb-2 items-center text-sm text-gray-700">
                        <div className="col-span-1">{setIndex + 1}</div>
                        <div className="col-span-4">{set.reps}</div>
                        <div className="col-span-3">{set.weight || '-'}</div>
                        <div className="col-span-4 flex items-center">
                           <Timer size={14} className="mr-1 text-gray-500" /> {set.restTime}s
                        </div>
                      </div>
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

export default WorkoutDetail;
