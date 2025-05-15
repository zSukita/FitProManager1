import React from 'react';
import { exerciseLibrary } from '../data/mockData';
import { Exercise } from '../types';
import { PlusCircle, Dumbbell, Video, Image } from 'lucide-react';

const ExerciseLibrary: React.FC = () => {
  // Estado para gerenciar a lista de exercícios (inicialmente mock data)
  const [exercises, setExercises] = React.useState<Exercise[]>(exerciseLibrary);
  // Estado para gerenciar a visibilidade do modal de adicionar exercício
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // Estado para o formulário de novo exercício
  const [newExercise, setNewExercise] = React.useState<Partial<Exercise>>({
    name: '',
    category: 'força',
    muscleGroup: 'peito',
    equipment: 'nenhum',
    difficulty: 'iniciante',
    description: '',
    videoUrl: '',
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.category && newExercise.muscleGroup && newExercise.equipment && newExercise.difficulty && newExercise.description) {
      const addedExercise: Exercise = {
        ...newExercise,
        id: `ex-${Date.now()}`, // Gerar um ID simples baseado no timestamp
        category: newExercise.category as any, // Cast para o tipo correto
        muscleGroup: newExercise.muscleGroup as any, // Cast para o tipo correto
        equipment: newExercise.equipment as any, // Cast para o tipo correto
        difficulty: newExercise.difficulty as any, // Cast para o tipo correto
      };
      setExercises([...exercises, addedExercise]);
      setIsModalOpen(false);
      setNewExercise({ // Resetar formulário
        name: '',
        category: 'força',
        muscleGroup: 'peito',
        equipment: 'nenhum',
        difficulty: 'iniciante',
        description: '',
        videoUrl: '',
        imageUrl: '',
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Biblioteca de Exercícios</h1>
          <p className="text-gray-600">Gerencie seus exercícios disponíveis</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={20} />
          Adicionar Exercício
        </button>
      </div>

      {/* Lista de Exercícios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="card flex flex-col">
            <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
              <img
                src={exercise.imageUrl || 'https://images.pexels.com/photos/1557109/pexels-photo-1557109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} // Imagem padrão se não houver
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-lg font-bold">{exercise.name}</h3>
                <p className="text-sm">{exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}</p>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-4">
                <span className="badge badge-secondary">{exercise.category}</span>
                <span className="badge badge-accent">{exercise.equipment}</span>
                <span className="badge badge-primary">{exercise.difficulty}</span>
              </div>
              <div className="flex gap-2">
                {exercise.videoUrl && (
                  <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary btn-sm flex items-center gap-1">
                    <Video size={16} /> Vídeo
                  </a>
                )}
                 {exercise.imageUrl && (
                  <a href={exercise.imageUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-secondary btn-sm flex items-center gap-1">
                    <Image size={16} /> Imagem
                  </a>
                )}
                {/* Botões de Editar/Excluir (implementar depois) */}
                {/* <button className="btn-outline-primary btn-sm">Editar</button>
                <button className="btn-outline-danger btn-sm">Excluir</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adicionar Exercício */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Exercício</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Exercício</label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
                  value={newExercise.description}
                  onChange={handleInputChange}
                  className="input"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select
                    name="category"
                    value={newExercise.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="força">Força</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibilidade">Flexibilidade</option>
                    <option value="equilíbrio">Equilíbrio</option>
                    <option value="funcional">Funcional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grupo Muscular</label>
                  <select
                    name="muscleGroup"
                    value={newExercise.muscleGroup}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
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
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Equipamento</label>
                  <select
                    name="equipment"
                    value={newExercise.equipment}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="nenhum">Nenhum</option>
                    <option value="halteres">Halteres</option>
                    <option value="barra">Barra</option>
                    <option value="máquina">Máquina</option>
                    <option value="kettlebell">Kettlebell</option>
                    <option value="elástico">Elástico</option>
                    <option value="corda">Corda</option>
                    <option value="banco">Banco</option>
                    <option value="bola">Bola</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dificuldade</label>
                  <select
                    name="difficulty"
                    value={newExercise.difficulty}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediário">Intermediário</option>
                    <option value="avançado">Avançado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL do Vídeo (Opcional)</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={newExercise.videoUrl}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL da Imagem (Opcional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newExercise.imageUrl}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="btn-outline-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleAddExercise}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
