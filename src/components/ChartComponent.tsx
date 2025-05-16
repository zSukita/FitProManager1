import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  import { useQuery } from '@tanstack/react-query';
  import { fetchMonthlyClients, fetchMonthlyRevenue } from '../services/supabaseService';
  import { useAuth } from '../lib/auth';

  const ChartComponent = () => {
    const { user } = useAuth();
    const trainerId = user?.id || '';
    
    const { data: clientData, isLoading: clientsLoading } = useQuery(
      ['monthlyClients', trainerId],
      () => fetchMonthlyClients(trainerId)
    );
    
    const { data: revenueData, isLoading: revenueLoading } = useQuery(
      ['monthlyRevenue', trainerId],
      () => fetchMonthlyRevenue(trainerId)
    );

    if (clientsLoading || revenueLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData.map((entry, index) => ({
              ...entry,
              clients: clientData[index]?.count || 0
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total"
              name="Receita Mensal"
              stroke="#22c55e"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="clients"
              name="Novos Clientes"
              stroke="#3b82f6"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  export default ChartComponent;
