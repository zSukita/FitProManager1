import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Workouts from './pages/Workouts';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';
import ClientDetail from './pages/ClientDetail';
import WorkoutDetail from './pages/WorkoutDetail';
import Plans from './pages/Plans'; // Importe a nova página de Planos

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    // Opcional: Adicionar um spinner ou tela de carregamento
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rotas Autenticadas */}
      {/* A rota pai "/" renderiza o DashboardLayout */}
      <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/auth/login" />}>
        {/* A rota index "/" dentro do DashboardLayout renderiza o Dashboard */}
        <Route index element={<Dashboard />} />
        {/* Rotas aninhadas dentro do DashboardLayout */}
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="workouts/:workoutId" element={<WorkoutDetail />} />
        <Route path="finances" element={<Finances />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/plans" element={<Plans />} /> {/* Adicione a rota para a página de Planos */}
      </Route>

      {/* Rotas de Autenticação */}
      <Route path="/auth" element={!user ? <AuthLayout /> : <Navigate to="/" />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth/login"} />} />
    </Routes>
  );
}

export default App;
