import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clients } from '../data/mockData'; // Usar mock data por enquanto
import { Payment } from '../types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const NewPayment: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Payment & { clientId: string }>>({
    clientId: '',
    amount: undefined,
    date: dayjs().format('YYYY-MM-DD'), // Data atual por padrão
    dueDate: '',
    status: 'pendente',
    method: undefined,
    description: '',
    recurrent: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'amount') {
       setFormData({
        ...formData,
        [name]: parseFloat(value) || undefined, // Converte para número, lida com NaN
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.clientId || formData.amount === undefined || formData.amount <= 0 || !formData.date) {
      toast.error('Por favor, preencha os campos obrigatórios (Cliente, Valor, Data).');
      return;
    }

    // Create a new payment object (using mock data structure for now)
    const newPayment: Payment = {
      id: `pay-${Date.now()}`, // Generate a simple unique ID
      clientId: formData.clientId,
      amount: formData.amount,
      date: formData.date,
      dueDate: formData.dueDate || undefined, // Use undefined if empty
      status: formData.status || 'pendente',
      method: formData.method as Payment['method'] || undefined, // Cast and use undefined if empty
      description: formData.description || undefined, // Use undefined if empty
      recurrent: formData.recurrent || false,
    };

    console.log('Novo Pagamento:', newPayment); // Log the new payment data

    // In a real application, you would send this data to your backend/Supabase
    // Example: supabase.from('payments').insert([newPayment])

    toast.success('Pagamento registrado com sucesso (simulado)!');

    // Optionally navigate back to the finances list
    navigate('/finances');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/finances')}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          aria-label="Voltar para Finanças"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Novo Pagamento</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente */}
          <div>
            <label htmlFor="clientId" className="label">Cliente</label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label htmlFor="amount" className="label">Valor (R$)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount === undefined ? '' : formData.amount}
              onChange={handleInputChange}
              className="input-field"
              step="0.01"
              required
            />
          </div>

          {/* Data do Pagamento */}
          <div>
            <label htmlFor="date" className="label">Data do Pagamento</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          {/* Data de Vencimento (Opcional) */}
          <div>
            <label htmlFor="dueDate" className="label">Data de Vencimento (Opcional)</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Método de Pagamento (Opcional) */}
          <div>
            <label htmlFor="method" className="label">Método de Pagamento (Opcional)</label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Selecione o método</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartão">Cartão</option>
              <option value="pix">PIX</option>
              <option value="transferência">Transferência</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Descrição (Opcional) */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="label">Descrição (Opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              rows={3}
            ></textarea>
          </div>

          {/* Recorrente */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="recurrent"
              name="recurrent"
              checked={formData.recurrent}
              onChange={handleInputChange}
              className="mr-2 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="recurrent" className="label mb-0">Pagamento Recorrente</label>
          </div>

          {/* Botão de Submissão */}
          <div className="md:col-span-2 flex justify-end gap-4">
             <button
              type="button"
              onClick={() => navigate('/finances')}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Registrar Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPayment;
