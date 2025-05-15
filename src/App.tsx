import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import NewClient from './pages/NewClient';
import Workouts from './pages/Workouts';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';
import ClientDetail from './pages/ClientDetail';
import WorkoutDetail from './pages/WorkoutDetail';
import Plans from './pages/Plans';
import WorkoutBuilder from './pages/WorkoutBuilder';
import { exerciseLibrary } from './data/mockData';
import NewPayment from './pages/NewPayment'; // Import the new page

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rotas Autenticadas que usam o DashboardLayout */}
      <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/auth/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<NewClient />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        {/* Add nested routes for finances here */}
        <Route path="finances" element={<Finances />} />
        <Route path="finances/new" element={<NewPayment />} /> {/* Add the new payment route */}
        <Route path="settings" element={<Settings />} />
        <Route path="settings/plans" element={<Plans />} />
      </Route>

      {/* Workouts routes are separate */}
      <Route path="/workouts" element={user ? <DashboardLayout /> : <Navigate to="/auth/login" />}>
         <Route index element={<Workouts />} />
         <Route path="new" element={<WorkoutBuilder exercises={exerciseLibrary} />} />
         <Route path=":workoutId" element={<WorkoutDetail />} />
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
