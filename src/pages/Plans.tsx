import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, Edit, Trash2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Plan, PlanFrequency, Client } from '../types';
import { plans as initialPlans, clients as initialClients } from '../data/mockData'; // Importar mock data

// Mock de dados e funções CRUD (em um cenário real, viriam de uma API/Banco de Dados)
// Usamos let para poder "atualizar" esses arrays mockados
let currentPlans: Plan[] = [...initialPlans];
let currentClients: Client[] = [...initialClients];

const getPlans = (): Plan[] => currentPlans;

const getClients = (): Client[] => currentClients;

const createPlan = (newPlan: Omit<Plan, 'id'>): Plan => {
  const planWithId = { ...newPlan, id: `plan-${Date.now()}` };
  currentPlans.push(planWithId);
  toast.success('Plano criado com sucesso!');
  return planWithId;
};

const updatePlan = (updatedPlan: Plan): Plan | undefined => {
  const index = currentPlans.findIndex(p => p.id === updatedPlan.id);
  if (index !== -1) {
    currentPlans[index] = updatedPlan;
    toast.success('Plano atualizado com sucesso!');
    return updatedPlan;
  }
  toast.error('Plano não encontrado.');
  return undefined;
};

const deletePlan = (planId: string): boolean => {
  const initialLength = currentPlans.length;
  currentPlans = currentPlans.filter(p => p.id !== planId);
  // Remover associação de clientes a este plano
  currentClients = currentClients.map(client =>
    client.planId === planId ? { ...client, planId: undefined } : client
  );
  if (currentPlans.length < initialLength) {
    toast.success('Plano excluído com sucesso!');
    return true;
  }
  toast.error('Plano não encontrado.');
  return false;
};

const assignClientToPlan = (clientId: string, planId: string): Client | undefined => {
  const clientIndex = currentClients.findIndex(c => c.id === clientId);
  if (clientIndex !== -1) {
    currentClients[clientIndex].planId = planId;
    toast.success(`Cliente ${currentClients[clientIndex].name} associado ao plano!`);
    return currentClients[clientIndex];
  }
  toast.error('Cliente não encontrado.');
  return undefined;
};

const removeClientFromPlan = (clientId: string): Client | undefined => {
  const clientIndex = currentClients.findIndex(c => c.id === clientId);
  if (clientIndex !== -1 && currentClients[clientIndex].planId) {
    currentClients[clientIndex].planId = undefined;
    toast.success(`Cliente ${currentClients[clientIndex].name} desassociado do plano!`);
    return currentClients[clientIndex];
  }
  toast.error('Cliente não encontrado ou sem plano associado.');
  return undefined;
};


const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(getPlans());
  const [clients, setClients] = useState<Client[]>(getClients());
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [selectedPlanForClients, setSelectedPlanForClients] = useState<Plan | null>(null);

  const [planFormData, setPlanFormData] = useState<Omit<Plan, 'id'>>({
    name: '',
    price: 0,
    frequency: 'mensal',
    features: [],
    clientLimit: 0,
    sessionsPerPeriod: undefined,
    durationInMonths: undefined,
    isDefault: false,
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setPlanFormData({
        name: editingPlan.name,
        price: editingPlan.price,
        frequency: editingPlan.frequency,
        features: editingPlan.features,
        clientLimit: editingPlan.clientLimit,
        sessionsPerPeriod: editingPlan.sessionsPerPeriod,
        durationInMonths: editingPlan.durationInMonths,
        isDefault: editingPlan.isDefault || false,
      });
    } else {
      setPlanFormData({
        name: '',
        price: 0,
        frequency: 'mensal',
        features: [],
        clientLimit: 0,
        sessionsPerPeriod: undefined,
        durationInMonths: undefined,
        isDefault: false,
      });
    }
  }, [editingPlan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPlanFormData({
      ...planFormData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, checked } = e.target;
     setPlanFormData({
       ...planFormData,
       [name]: checked,
     });
  };

  const handleFeatureAdd = () => {
    if (featureInput.trim() && !planFormData.features.includes(featureInput.trim())) {
      setPlanFormData({
        ...planFormData,
        features: [...planFormData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleFeatureRemove = (featureToRemove: string) => {
    setPlanFormData({
      ...planFormData,
      features: planFormData.features.filter(feature => feature !== featureToRemove),
    });
  };

  const handleSavePlan = () => {
    if (!planFormData.name || planFormData.price < 0 || planFormData.clientLimit < 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios e verifique os valores.');
      return;
    }

    if (editingPlan) {
      const updated = updatePlan({ ...planFormData, id: editingPlan.id });
      if (updated) {
        setPlans(getPlans()); // Refresh state from mock data
        setShowPlanModal(false);
        setEditingPlan(null);
      }
    } else {
      const newPlan = createPlan(planFormData);
      setPlans(getPlans()); // Refresh state from mock data
      setShowPlanModal(false);
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      if (deletePlan(planId)) {
        setPlans(getPlans()); // Refresh state from mock data
        setClients(getClients()); // Clients might have been unassigned
      }
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowPlanModal(true);
  };

  const handleOpenCreatePlanModal = () => {
    setEditingPlan(null);
    setShowPlanModal(true);
  };

  const handleClosePlanModal = () => {
    setShowPlanModal(false);
    setEditingPlan(null);
    setFeatureInput(''); // Clear feature input
  };

  const handleOpenClientModal = (plan: Plan) => {
    setSelectedPlanForClients(plan);
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => {
    setSelectedPlanForClients(null);
    setShowClientModal(false);
  };

  const handleAssignClient = (clientId: string) => {
    if (selectedPlanForClients) {
      const updatedClient = assignClientToPlan(clientId, selectedPlanForClients.id);
      if (updatedClient) {
        setClients(getClients()); // Refresh clients state
        setPlans(getPlans()); // Refresh plans state (client count might change)
      }
    }
  };

  const handleRemoveClient = (clientId: string) => {
    const updatedClient = removeClientFromPlan(clientId);
    if (updatedClient) {
      setClients(getClients()); // Refresh clients state
      setPlans(getPlans()); // Refresh plans state
    }
  };

  const getClientsForPlan = (planId: string) => {
    return clients.filter(client => client.planId === planId);
  };

  const getClientsWithoutPlan = () => {
    return clients.filter(client => !client.planId);
  };


  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Planos</h1>
          <p className="text-gray-600">Crie, edite e associe clientes aos seus planos.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleOpenCreatePlanModal}>
          <Plus size={20} /> Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm p-6 flex flex-col ${plan.isDefault ? 'border-2 border-primary' : 'border border-gray-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <div className="flex gap-2">
                 <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleOpenClientModal(plan)}
                    title="Gerenciar Clientes"
                 >
                    <Users size={20} />
                 </button>
                <button
                  className="text-yellow-600 hover:text-yellow-800"
                  onClick={() => handleEditPlan(plan)}
                  title="Editar Plano"
                >
                  <Edit size={20} />
                </button>
                {!plan.isDefault && ( // Prevent deleting default plan
                   <button
                     className="text-red-600 hover:text-red-800"
                     onClick={() => handleDeletePlan(plan.id)}
                     title="Excluir Plano"
                   >
                     <Trash2 size={20} />
                   </button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-800">
                 {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
              </span>
              {plan.frequency !== 'vitalicio' && plan.price > 0 && (
                 <span className="text-gray-600">/{plan.frequency}</span>
              )}
               {plan.frequency === 'vitalicio' && plan.price === 0 && (
                 <span className="text-gray-600">para sempre</span>
              )}
            </div>

            <ul className="space-y-3 flex-grow mb-6">
              <li className="flex items-start gap-2 text-gray-700">
                 <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
                 <span>Limite de Clientes: {plan.clientLimit === 'ilimitado' ? 'Ilimitado' : plan.clientLimit}</span>
              </li>
               {plan.sessionsPerPeriod !== undefined && (
                 <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
                    <span>Sessões/Período: {plan.sessionsPerPeriod === 'ilimitado' ? 'Ilimitado' : plan.sessionsPerPeriod}</span>
                 </li>
               )}
               {plan.durationInMonths !== undefined && (
                 <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
                    <span>Duração: {plan.durationInMonths} meses</span>
                 </li>
               )}
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

             <div className="mt-auto"> {/* Push button to the bottom */}
               {plan.isDefault ? (
                 <button className="btn-outline w-full cursor-not-allowed opacity-60" disabled>
                   Plano Padrão
                 </button>
               ) : (
                 <button
                   className="btn-secondary w-full"
                   onClick={() => toast('Funcionalidade de contratação em desenvolvimento')}
                 >
                   Selecionar Plano
                 </button>
               )}
             </div>
          </div>
        ))}
      </div>

      {/* Plan Modal (Create/Edit) */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">{editingPlan ? 'Editar Plano' : 'Novo Plano'}</h3>
              <button onClick={handleClosePlanModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={planFormData.name}
                  onChange={handleInputChange}
                  className="input-text"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={planFormData.price}
                  onChange={handleInputChange}
                  className="input-text"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
                  Frequência
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={planFormData.frequency}
                  onChange={handleInputChange}
                  className="input-select"
                  required
                >
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                  <option value="sessao_unica">Sessão Única</option>
                  <option value="vitalicio">Vitalício</option>
                </select>
              </div>

              {/* Conditional fields based on frequency */}
              {(planFormData.frequency === 'trimestral' || planFormData.frequency === 'semestral' || planFormData.frequency === 'anual') && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="durationInMonths">
                       Duração em Meses
                    </label>
                    <input
                       type="number"
                       id="durationInMonths"
                       name="durationInMonths"
                       value={planFormData.durationInMonths || ''}
                       onChange={handleInputChange}
                       className="input-text"
                       min="1"
                       required
                    />
                 </div>
              )}

              {(planFormData.frequency === 'sessao_unica' || planFormData.clientLimit !== 'ilimitado') && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sessionsPerPeriod">
                       Sessões/Treinos por Período (Opcional)
                    </label>
                    <input
                       type="number"
                       id="sessionsPerPeriod"
                       name="sessionsPerPeriod"
                       value={planFormData.sessionsPerPeriod || ''}
                       onChange={handleInputChange}
                       className="input-text"
                       min="1"
                    />
                 </div>
              )}


              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientLimit">
                  Limite de Clientes
                </label>
                 <select
                   id="clientLimit"
                   name="clientLimit"
                   value={planFormData.clientLimit}
                   onChange={handleInputChange}
                   className="input-select"
                   required
                 >
                   <option value="ilimitado">Ilimitado</option>
                   {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                     <option key={num} value={num}>{num}</option>
                   ))}
                 </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Recursos
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="input-text flex-grow"
                    placeholder="Adicionar recurso"
                  />
                  <button type="button" onClick={handleFeatureAdd} className="btn-secondary">
                    Adicionar
                  </button>
                </div>
                <ul className="list-disc list-inside">
                  {planFormData.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-between text-gray-700 text-sm">
                      {feature}
                      <button type="button" onClick={() => handleFeatureRemove(feature)} className="text-red-500 hover:text-red-700 ml-2">
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

               <div className="mb-4">
                 <label className="flex items-center text-gray-700 text-sm font-bold">
                   <input
                     type="checkbox"
                     name="isDefault"
                     checked={planFormData.isDefault}
                     onChange={handleCheckboxChange}
                     className="mr-2 leading-tight"
                   />
                   Plano Padrão (Novo usuário recebe este plano)
                 </label>
               </div>

            </div>
            <div className="flex justify-end p-6 border-t">
              <button onClick={handleClosePlanModal} className="btn-outline mr-2">
                Cancelar
              </button>
              <button onClick={handleSavePlan} className="btn-primary">
                {editingPlan ? 'Salvar Alterações' : 'Criar Plano'}
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Client Association Modal */}
       {showClientModal && selectedPlanForClients && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center p-6 border-b">
               <h3 className="text-xl font-semibold">Clientes do Plano: {selectedPlanForClients.name}</h3>
               <button onClick={handleCloseClientModal} className="text-gray-500 hover:text-gray-700">
                 <X size={24} />
               </button>
             </div>
             <div className="p-6">
               <h4 className="text-lg font-semibold mb-3">Clientes Atualmente Associados</h4>
               {getClientsForPlan(selectedPlanForClients.id).length > 0 ? (
                 <ul>
                   {getClientsForPlan(selectedPlanForClients.id).map(client => (
                     <li key={client.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                       <span>{client.name}</span>
                       <button
                         className="text-red-600 hover:text-red-800 text-sm"
                         onClick={() => handleRemoveClient(client.id)}
                       >
                         Desassociar
                       </button>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-600 italic">Nenhum cliente associado a este plano.</p>
               )}

               <h4 className="text-lg font-semibold mt-6 mb-3">Associar Novos Clientes</h4>
               {getClientsWithoutPlan().length > 0 ? (
                 <ul>
                   {getClientsWithoutPlan().map(client => (
                     <li key={client.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                       <span>{client.name}</span>
                       <button
                         className="btn-secondary btn-sm"
                         onClick={() => handleAssignClient(client.id)}
                       >
                         Associar
                       </button>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-600 italic">Todos os clientes já possuem um plano.</p>
               )}
             </div>
             <div className="flex justify-end p-6 border-t">
               <button onClick={handleCloseClientModal} className="btn-outline">
                 Fechar
               </button>
             </div>
           </div>
         </div>
       )}

    </div>
  );
};

export default Plans;