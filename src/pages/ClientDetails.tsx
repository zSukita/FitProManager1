import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Save, X, Plus, BarChart3, FileText, DollarSign, Dumbbell } from 'lucide-react';
import { clients, workouts } from '../data/mockData';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const client = clients.find(c => c.id === id);
  
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [clientData, setClientData] = useState(client);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Cliente não encontrado</h2>
        <button 
          className="mt-4 btn-primary"
          onClick={() => navigate('/clientes')}
        >
          Voltar para a lista de clientes
        </button>
      </div>
    );
  }

  // Configuração do gráfico de peso
  const weightChartData = {
    labels: client.measurements?.map(m => dayjs(m.date).format('DD/MM/YY')) || [],
    datasets: [
      {
        label: 'Peso (kg)',
        data: client.measurements?.map(m => m.weight) || [],
        fill: false,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4,
      },
    ],
  };

  // Configuração do gráfico de gordura corporal
  const bodyFatChartData = {
    labels: client.measurements?.filter(m => m.bodyFat).map(m => dayjs(m.date).format('DD/MM/YY')) || [],
    datasets: [
      {
        label: 'Gordura Corporal (%)',
        data: client.measurements?.filter(m => m.bodyFat).map(m => m.bodyFat) || [],
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
      },
    ],
  };

  // Cliente treinos
  const clientWorkouts = workouts.filter(workout => workout.clientIds?.includes(client.id));

  // Função para salvar alterações
  const handleSave = () => {
    // Simulação de salvamento
    setIsEditing(false);
    toast.success('Informações do cliente atualizadas com sucesso!');
  };

  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Ativo</span>;
      case 'inativo':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inativo</span>;
      case 'pendente':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      default:
        return null;
    }
  };

  // Status de pagamento
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>;
      case 'pendente':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'atrasado':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Atrasado</span>;
      case 'cancelado':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/clientes')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {client.name}
              {getStatusBadge(client.status)}
            </h1>
            <p className="text-gray-600">{client.email} • {client.phone}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="btn-primary flex items-center gap-1"
              >
                <Save size={18} />
                Salvar
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="btn-outline flex items-center gap-1"
              >
                <X size={18} />
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center gap-1"
              >
                <Edit size={18} />
                Editar
              </button>
              <button className="btn-outline flex items-center gap-1 text-red-600 hover:bg-red-50">
                <Trash2 size={18} />
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      {/* Perfil e abas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil do cliente */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
            <div className="px-6 pt-0 pb-6 -mt-16">
              <img 
                src={client.avatar || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                alt={client.name} 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              
              <div className="mt-4">
                <h3 className="text-xl font-semibold">{client.name}</h3>
                <p className="text-sm text-gray-600">
                  {client.age} anos • {client.gender === 'masculino' ? 'Masculino' : client.gender === 'feminino' ? 'Feminino' : 'Outro'}
                </p>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Objetivo Principal</h4>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-md">{client.goal}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente desde</h4>
                <p className="text-gray-800">{dayjs(client.startDate).format('DD/MM/YYYY')}</p>
              </div>
              
              {client.medicalHistory && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico Médico</h4>
                  <p className="text-gray-800">{client.medicalHistory}</p>
                </div>
              )}
              
              {client.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Observações</h4>
                  <p className="text-gray-800">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div className="lg:col-span-2">
          {/* Navegação das abas */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b flex overflow-x-auto">
              <button 
                className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('info')}
              >
                <FileText size={18} />
                Informações
              </button>
              <button 
                className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'evolution' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('evolution')}
              >
                <BarChart3 size={18} />
                Evolução
              </button>
              <button 
                className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'payments' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('payments')}
              >
                <DollarSign size={18} />
                Pagamentos
              </button>
              <button 
                className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'workouts' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('workouts')}
              >
                <Dumbbell size={18} />
                Treinos
              </button>
            </div>
          </div>

          {/* Conteúdo da aba ativa */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'info' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nome completo</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="input-field" 
                        value={clientData?.name}
                        onChange={(e) => setClientData({...clientData!, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-800">{client.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Email</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        className="input-field" 
                        value={clientData?.email}
                        onChange={(e) => setClientData({...clientData!, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-800">{client.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Telefone</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="input-field" 
                        value={clientData?.phone}
                        onChange={(e) => setClientData({...clientData!, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-800">{client.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Idade</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        className="input-field" 
                        value={clientData?.age}
                        onChange={(e) => setClientData({...clientData!, age: parseInt(e.target.value)})}
                      />
                    ) : (
                      <p className="text-gray-800">{client.age} anos</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Gênero</label>
                    {isEditing ? (
                      <select 
                        className="input-field" 
                        value={clientData?.gender}
                        onChange={(e) => setClientData({...clientData!, gender: e.target.value as any})}
                      >
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{client.gender === 'masculino' ? 'Masculino' : client.gender === 'feminino' ? 'Feminino' : 'Outro'}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Status</label>
                    {isEditing ? (
                      <select 
                        className="input-field" 
                        value={clientData?.status}
                        onChange={(e) => setClientData({...clientData!, status: e.target.value as any})}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="pendente">Pendente</option>
                      </select>
                    ) : (
                      <p className="flex items-center">{getStatusBadge(client.status)}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="label">Objetivo</label>
                  {isEditing ? (
                    <textarea 
                      className="input-field min-h-[100px]" 
                      value={clientData?.goal}
                      onChange={(e) => setClientData({...clientData!, goal: e.target.value})}
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{client.goal}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="label">Histórico Médico</label>
                  {isEditing ? (
                    <textarea 
                      className="input-field min-h-[100px]" 
                      value={clientData?.medicalHistory || ''}
                      onChange={(e) => setClientData({...clientData!, medicalHistory: e.target.value})}
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{client.medicalHistory || 'Não informado'}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="label">Observações</label>
                  {isEditing ? (
                    <textarea 
                      className="input-field min-h-[100px]" 
                      value={clientData?.notes || ''}
                      onChange={(e) => setClientData({...clientData!, notes: e.target.value})}
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{client.notes || 'Nenhuma observação'}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'evolution' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Evolução do Cliente</h3>
                  <button className="btn-primary flex items-center gap-1">
                    <Plus size={18} />
                    Nova Medição
                  </button>
                </div>
                
                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Evolução de Peso</h4>
                    <div className="h-64">
                      <Line 
                        data={weightChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Evolução de Gordura Corporal</h4>
                    <div className="h-64">
                      <Line 
                        data={bodyFatChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tabela de medições */}
                <div className="overflow-x-auto mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Histórico de Medições</h4>
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Altura (cm)</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gordura (%)</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cintura (cm)</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quadril (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {client.measurements?.map((measurement, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{dayjs(measurement.date).format('DD/MM/YYYY')}</td>
                          <td className="py-3 px-4 text-sm">{measurement.weight}</td>
                          <td className="py-3 px-4 text-sm">{measurement.height}</td>
                          <td className="py-3 px-4 text-sm">{measurement.bodyFat || '-'}</td>
                          <td className="py-3 px-4 text-sm">{measurement.waist || '-'}</td>
                          <td className="py-3 px-4 text-sm">{measurement.hips || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
                  <button className="btn-primary flex items-center gap-1">
                    <Plus size={18} />
                    Novo Pagamento
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {client.payments?.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{payment.date ? dayjs(payment.date).format('DD/MM/YYYY') : '-'}</td>
                          <td className="py-3 px-4 text-sm">{payment.description}</td>
                          <td className="py-3 px-4 text-sm">R$ {payment.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">{payment.method || '-'}</td>
                          <td className="py-3 px-4 text-sm">{getPaymentStatusBadge(payment.status)}</td>
                          <td className="py-3 px-4 text-sm">{payment.dueDate ? dayjs(payment.dueDate).format('DD/MM/YYYY') : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'workouts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Treinos do Cliente</h3>
                  <button className="btn-primary flex items-center gap-1">
                    <Plus size={18} />
                    Atribuir Treino
                  </button>
                </div>
                
                {clientWorkouts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum treino atribuído</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Este cliente ainda não possui treinos atribuídos.
                    </p>
                    <div className="mt-6">
                      <button className="btn-primary">Criar Treino</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientWorkouts.map((workout) => (
                      <div key={workout.id} className="border rounded-lg p-4 hover:border-primary transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{workout.name}</h4>
                            <p className="text-sm text-gray-500">{workout.description}</p>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {workout.type}
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="text-xs text-gray-500 mb-1">Grupos musculares</div>
                          <div className="flex flex-wrap gap-1">
                            {workout.targetMuscleGroups.map((group, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                                {group}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-xs text-gray-500 mb-1">Exercícios</div>
                          <p className="text-sm text-gray-700">{workout.exercises.length} exercícios</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="text-sm text-primary font-medium hover:underline">
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
