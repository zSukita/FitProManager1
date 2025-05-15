import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPayment, fetchClients, getCurrentUser } from '../services/supabaseService'; // Import Supabase services
import { Client } from '../types'; // Import Client type

const NewPayment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]); // State to hold clients for dropdown
  const [clientsLoading, setClientsLoading] = useState(true);
  const [formData, setFormData] = useState({
    client_id: '', // Store client ID
    amount: '',
    payment_date: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD format
    method: 'Pix',
    notes: '',
  });

  useEffect(() => {
    const loadClientsForDropdown = async () => {
      setClientsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          const data = await fetchClients(user.id);
          setClients(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, client_id: data[0].id })); // Select first client by default
          }
        } else {
          toast.error('Usuário não autenticado.');
          setClients([]);
        }
      } catch (error) {
        console.error('Failed to load clients for dropdown:', error);
        toast.error('Erro ao carregar lista de clientes.');
      } finally {
        setClientsLoading(false);
      }
    };

    loadClientsForDropdown();
  }, []); // Load clients once on mount

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

      // Prepare data for insertion, converting amount to number
      const paymentDataToSave = {
        ...formData,
        amount: parseFloat(formData.amount), // Convert amount to number
        payment_date: new Date(formData.payment_date).toISOString(), // Ensure date is in ISO format
      };

      await createPayment(paymentDataToSave, user.id);

      toast.success('Pagamento registrado com sucesso!');
      navigate('/finances');
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error('Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/finances')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Novo Pagamento</h1>
          <p className="text-gray-600">Registre um novo pagamento de cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="client_id" className="label">Cliente</label>
            {clientsLoading ? (
              <p className="text-gray-500">Carregando clientes...</p>
            ) : clients.length === 0 ? (
               <p className="text-red-500">Nenhum cliente encontrado. Cadastre um cliente primeiro.</p>
            ) : (
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="label">Valor</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="payment_date" className="label">Data do Pagamento</label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="method" className="label">Método de Pagamento</label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência">Transferência</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
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
            onClick={() => navigate('/finances')}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || clientsLoading || clients.length === 0} // Disable if loading or no clients
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Salvando...' : 'Registrar Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPayment;
