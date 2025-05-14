import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Save, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Share,
  FileText,
  Timer,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  X
} from 'lucide-react';
import { Exercise, ExerciseSet, WorkoutExercise, ExerciseLibrary } from '../types';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface WorkoutBuilderProps {
  exercises: ExerciseLibrary;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({ exercises }) => {
  const navigate = useNavigate();
  
  // Estado para o treino
  const [workoutName, setWorkoutName] = useState('Novo Treino');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [workoutType, setWorkoutType] = useState('força');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [targetMuscleGroups, setTargetMuscleGroups] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  
  // Estado para a busca e filtragem de exercícios
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('todos');
  const [equipmentFilter, setEquipmentFilter] = useState('todos');
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Filtrar exercícios
  const filteredExercises = Object.values(exercises).filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleGroupFilter === 'todos' || exercise.muscleGroup === muscleGroupFilter;
    const matchesEquipment = equipmentFilter === 'todos' || exercise.equipment === equipmentFilter;
    
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  // Adicionar exercício ao treino
  const addExerciseToWorkout = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise,
        sets: [
          { reps: 12, weight: 0, restTime: 60 }
        ]
      }
    ]);

    // Adicionar grupo muscular ao treino se não existir
    if (!targetMuscleGroups.includes(exercise.muscleGroup)) {
      setTargetMuscleGroups([...targetMuscleGroups, exercise.muscleGroup]);
    }

    setShowExerciseLibrary(false);
    toast.success(`${exercise.name} adicionado ao treino!`);
  };

  // Adicionar série
  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...selectedExercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    
    updatedExercises[exerciseIndex].sets.push({
      ...lastSet
    });
    
    setSelectedExercises(updatedExercises);
  };

  // Remover série
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...selectedExercises];
    
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
      setSelectedExercises(updatedExercises);
    } else {
      toast.error('Um exercício deve ter pelo menos uma série!');
    }
  };

  // Atualizar série
  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof ExerciseSet, value: any) => {
    const updatedExercises = [...selectedExercises];
    
    if (field === 'reps' || field === 'weight' || field === 'restTime') {
      const numValue = parseInt(value);
      updatedExercises[exerciseIndex].sets[setIndex][field] = isNaN(numValue) ? 0 : numValue;
    } else {
      updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    }
    
    setSelectedExercises(updatedExercises);
  };

  // Remover exercício
  const removeExercise = (index: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
    
    // Atualizar grupos musculares
    const remainingMuscleGroups = updatedExercises.map(item => item.exercise.muscleGroup);
    setTargetMuscleGroups([...new Set(remainingMuscleGroups)]);
    
    toast.success('Exercício removido do treino!');
  };

  // Mover exercício para cima
  const moveExerciseUp = (index: number) => {
    if (index === 0) return;
    
    const updatedExercises = [...selectedExercises];
    [updatedExercises[index], updatedExercises[index - 1]] = [updatedExercises[index - 1], updatedExercises[index]];
    setSelectedExercises(updatedExercises);
  };

  // Mover exercício para baixo
  const moveExerciseDown = (index: number) => {
    if (index === selectedExercises.length - 1) return;
    
    const updatedExercises = [...selectedExercises];
    [updatedExercises[index], updatedExercises[index + 1]] = [updatedExercises[index + 1], updatedExercises[index]];
    setSelectedExercises(updatedExercises);
  };

  // Salvar treino
  const saveWorkout = () => {
    if (workoutName.trim() === '') {
      toast.error('Por favor, dê um nome ao treino!');
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast.error('Adicione pelo menos um exercício ao treino!');
      return;
    }
    
    // Simulação de salvamento
    toast.success('Treino salvo com sucesso!');
    navigate('/treinos');
  };

  // Exportar para PDF
  const exportToPdf = async () => {
    const element = document.getElementById('workout-preview');
    if (!element) return;
    
    toast.loading('Gerando PDF...');
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${workoutName}.pdf`);
      
      toast.dismiss();
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao gerar PDF. Tente novamente.');
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/treinos')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Montagem de Treino</h1>
            <p className="text-gray-600">Crie um treino personalizado</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={exportToPdf}
            className="btn-outline flex items-center gap-1"
          >
            <FileText size={18} />
            Exportar PDF
          </button>
          <button 
            onClick={() => toast.success('Link do treino copiado para a área de transferência!')}
            className="btn-outline flex items-center gap-1"
          >
            <Share size={18} />
            Compartilhar
          </button>
          <button 
            onClick={saveWorkout}
            className="btn-primary flex items-center gap-1"
          >
            <Save size={18} />
            Salvar Treino
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do treino */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Informações do Treino</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="workoutName" className="label">Nome do Treino</label>
                <input
                  id="workoutName"
                  type="text"
                  className="input-field"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Treino A - Superiores"
                />
              </div>
              
              <div>
                <label htmlFor="workoutType" className="label">Tipo de Treino</label>
                <select
                  id="workoutType"
                  className="input-field"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                >
                  <option value="força">Força</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="resistência">Resistência</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibilidade">Flexibilidade</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="workoutDescription" className="label">Descrição</label>
              <textarea
                id="workoutDescription"
                className="input-field"
                value={workoutDescription}
                onChange={(e) => setWorkoutDescription(e.target.value)}
                placeholder="Descreva o objetivo e características deste treino"
                rows={2}
              />
            </div>
            
            <div className="mt-4">
              <label className="label">Grupos Musculares Alvo</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {targetMuscleGroups.length > 0 ? (
                  targetMuscleGroups.map((group, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {group}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Adicione exercícios para definir os grupos musculares alvo</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="workoutNotes" className="label">Observações</label>
              <textarea
                id="workoutNotes"
                className="input-field"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Adicione observações, dicas ou instruções especiais"
                rows={2}
              />
            </div>
          </div>

          {/* Exercícios selecionados */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Exercícios do Treino</h2>
              <button 
                onClick={() => setShowExerciseLibrary(true)}
                className="btn-primary flex items-center gap-1 text-sm py-1.5"
              >
                <Plus size={16} />
                Adicionar Exercício
              </button>
            </div>
            
            {selectedExercises.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum exercício adicionado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Adicione exercícios ao treino para começar.
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => setShowExerciseLibrary(true)}
                    className="btn-primary"
                  >
                    Adicionar Exercício
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedExercises.map((item, exerciseIndex) => (
                  <div 
                    key={`${item.exercise.id}-${exerciseIndex}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 p-4 flex justify-between items-start border-b">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="text-xl font-semibold">{exerciseIndex + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.exercise.name}
                          </h3>
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveExerciseUp(exerciseIndex)}
                          disabled={exerciseIndex === 0}
                          className={`p-1.5 rounded-full ${exerciseIndex === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          <MoveUp size={16} />
                        </button>
                        <button
                          onClick={() => moveExerciseDown(exerciseIndex)}
                          disabled={exerciseIndex === selectedExercises.length - 1}
                          className={`p-1.5 rounded-full ${exerciseIndex === selectedExercises.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          <MoveDown size={16} />
                        </button>
                        <button
                          onClick={() => removeExercise(exerciseIndex)}
                          className="p-1.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setExpandedExercise(expandedExercise === item.exercise.id ? null : item.exercise.id)}
                          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                        >
                          {expandedExercise === item.exercise.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedExercise === item.exercise.id && (
                      <div className="p-4 bg-gray-50 border-b">
                        <p className="text-sm text-gray-700">{item.exercise.description}</p>
                        {item.exercise.imageUrl && (
                          <img 
                            src={item.exercise.imageUrl} 
                            alt={item.exercise.name} 
                            className="mt-3 rounded-lg w-full max-w-xs h-auto object-cover"
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500">
                        <div className="col-span-1">#</div>
                        <div className="col-span-4">Repetições</div>
                        <div className="col-span-3">Carga (kg)</div>
                        <div className="col-span-3">Descanso (s)</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {item.sets.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-12 gap-2 mb-2 items-center">
                          <div className="col-span-1 text-gray-500 text-sm">{setIndex + 1}</div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              className="input-field py-1.5"
                              value={set.reps}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              className="input-field py-1.5"
                              value={set.weight}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <div className="relative">
                              <input
                                type="number"
                                className="input-field py-1.5 pl-7"
                                value={set.restTime}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'restTime', e.target.value)}
                              />
                              <Timer className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <button
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                              className="p-1.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500"
                              title="Remover série"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => addSet(exerciseIndex)}
                        className="mt-2 text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                      >
                        <Plus size={16} className="mr-1" />
                        Adicionar série
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Biblioteca de exercícios */}
        <div className="lg:col-span-1">
          <div className={`bg-white rounded-lg shadow-sm p-6 sticky top-20 transition-all transform ${showExerciseLibrary ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Biblioteca de Exercícios</h2>
              <button 
                onClick={() => setShowExerciseLibrary(false)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar exercícios..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <select
                  className="input-field text-sm py-1.5"
                  value={muscleGroupFilter}
                  onChange={(e) => setMuscleGroupFilter(e.target.value)}
                >
                  <option value="todos">Todos os Músculos</option>
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
              <div>
                <select
                  className="input-field text-sm py-1.5"
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                >
                  <option value="todos">Todos os Equipamentos</option>
                  <option value="nenhum">Sem Equipamento</option>
                  <option value="halteres">Halteres</option>
                  <option value="barra">Barra</option>
                  <option value="máquina">Máquina</option>
                  <option value="kettlebell">Kettlebell</option>
                  <option value="elástico">Elástico</option>
                  <option value="banco">Banco</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredExercises.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nenhum exercício encontrado com os filtros aplicados.
                </p>
              ) : (
                filteredExercises.map(exercise => (
                  <div 
                    key={exercise.id}
                    className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-all"
                    onClick={() => addExerciseToWorkout(exercise)}
                  >
                    <h3 className="font-medium text-gray-800 text-sm">{exercise.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {exercise.muscleGroup}
                      </span>
                      <span className="mx-1 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {exercise.equipment}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visão prévia (oculta, usada apenas para exportação) */}
      <div id="workout-preview" className="hidden p-6 bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">{workoutName}</h1>
        <p className="text-center mb-6">{workoutDescription}</p>
        
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">Tipo de Treino:</div>
          <p>{workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}</p>
        </div>
        
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">Grupos Musculares:</div>
          <div className="flex flex-wrap gap-2">
            {targetMuscleGroups.map((group, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                {group}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">Observações:</div>
          <p>{workoutNotes || 'Nenhuma observação.'}</p>
        </div>
        
        <div>
          <div className="text-xl font-bold mb-4">Exercícios:</div>
          {selectedExercises.map((item, exerciseIndex) => (
            <div key={exerciseIndex} className="mb-6 pb-4 border-b">
              <div className="flex items-start gap-2 mb-2">
                <div className="font-semibold">{exerciseIndex + 1}.</div>
                <div>
                  <div className="font-semibold">{item.exercise.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{item.exercise.description}</div>
                  
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-1 text-left">Série</th>
                        <th className="py-1 text-left">Repetições</th>
                        <th className="py-1 text-left">Carga (kg)</th>
                        <th className="py-1 text-left">Descanso (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.sets.map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td className="py-1">{setIndex + 1}</td>
                          <td className="py-1">{set.reps}</td>
                          <td className="py-1">{set.weight || '-'}</td>
                          <td className="py-1">{set.restTime}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
