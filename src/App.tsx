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
import Plans from './pages/Plans';
// Removed ExerciseLibrary import
import WorkoutBuilder from './pages/WorkoutBuilder';
import { exerciseLibrary } from './data/mockData'; // Import exerciseLibrary

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    // Opcional: Adicionar um spinner ou tela de carregamento
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rotas Autenticadas que usam o DashboardLayout */}
      {/* Rota raiz e outras rotas de nível superior */}
      <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/auth/login" />}>
        <Route index element={<Dashboard />} /> {/* Rota para o Dashboard em "/" */}
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        <Route path="finances" element={<Finances />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/plans" element={<Plans />} />
        {/* Removed ExerciseLibrary route */}
      </Route>

      {/* Rota específica para Treinos, também usando DashboardLayout */}
      {/* Isso pode ajudar a isolar o comportamento das rotas de treino */}
      <Route path="/workouts" element={user ? <DashboardLayout /> : <Navigate to="/auth/login" />}>
         <Route index element={<Workouts />} /> {/* Rota para a lista de treinos em "/workouts" */}
         {/* Pass exerciseLibrary to WorkoutBuilder */}
         <Route path="new" element={<WorkoutBuilder exercises={exerciseLibrary} />} /> {/* Rota para criar novo treino em "/workouts/new" */}
         <Route path=":workoutId" element={<WorkoutDetail />} /> {/* Rota para detalhes do treino em "/workouts/:workoutId" */}
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
