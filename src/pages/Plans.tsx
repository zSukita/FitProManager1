import React from 'react';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: string;
  frequency: string;
  features: string[];
  isCurrent?: boolean;
}

const plans: Plan[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    price: 'Grátis',
    frequency: 'para sempre',
    features: [
      'Até 5 clientes',
      'Criação de treinos básicos',
      'Acompanhamento de medidas',
      'Suporte por email'
    ],
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 'R$ 99,90',
    frequency: '/mês',
    features: [
      'Até 50 clientes',
      'Criação ilimitada de treinos',
      'Biblioteca de exercícios',
      'Acompanhamento financeiro',
      'Suporte prioritário'
    ],
    isCurrent: true, // Exemplo: marcar este como o plano atual
  },
  {
    id: 'estudio',
    name: 'Estúdio',
    price: 'R$ 249,90',
    frequency: '/mês',
    features: [
      'Clientes ilimitados',
      'Múltiplos usuários (equipe)',
      'Recursos avançados de finanças',
      'Personalização da marca',
      'Suporte dedicado'
    ],
  },
];

const Plans: React.FC = () => {

  const handleSelectPlan = (planName: string) => {
    toast.success(`Plano "${planName}" selecionado! (Funcionalidade de contratação em desenvolvimento)`);
    // Aqui seria a lógica para iniciar o processo de contratação/alteração
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Escolha seu Plano</h1>
        <p className="text-gray-600">Encontre o plano perfeito para suas necessidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm p-6 flex flex-col ${plan.isCurrent ? 'border-2 border-primary' : 'border border-gray-200'}`}
          >
            <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
              <span className="text-gray-600">{plan.frequency}</span>
            </div>

            <ul className="space-y-3 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {plan.isCurrent ? (
                <button className="btn-outline w-full cursor-not-allowed opacity-60" disabled>
                  Plano Atual
                </button>
              ) : (
                <button
                  className="btn-primary w-full"
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  Selecionar Plano
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
