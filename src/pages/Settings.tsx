import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Bell,
  Mail,
  Lock,
  CreditCard,
  Building2,
  Palette,
  Save,
  X,
  Shield, // Icon for Segurança
  Briefcase, // Icon for Empresa
  Layout, // Icon for Aparência
  Wallet, // Icon for Payment Method
  Calendar // Icon for Payment History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estados para as configurações do perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999', // Placeholder phone
    bio: 'Personal Trainer especializado em hipertrofia e emagrecimento', // Placeholder bio
    avatar: user?.avatar || ''
  });

  // Estados para as configurações de notificação
  const [notifications, setNotifications] = useState({
    email: {
      newClient: true,
      payment: true,
      cancelation: true,
      reminder: false // Reminder is not in the email section in the image
    },
    push: {
      newClient: true,
      payment: true,
      cancelation: true, // Cancelation is not in the push section in the image
      reminder: true
    }
  });

  // Estados para as configurações de segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    twoFactorEnabled: false, // Placeholder state
    activeSessions: [ // Placeholder data
      { id: 1, device: 'Chrome - Windows', location: 'São Paulo, Brasil', status: 'Ativo agora' },
      { id: 2, device: 'Safari - iPhone', location: 'São Paulo, Brasil', status: '2 horas atrás' },
    ]
  });


  // Estados para as configurações de plano (Placeholder)
  const [planInfo] = useState({
    currentPlan: user?.plan || 'Profissional', // Use a string name
    clientsLimit: 50,
    clientsCount: 22,
    nextBilling: '14/04/2024', // Format as dd/mm/yyyy
    price: '99,90' // Store price as string or number, format for display
  });

  // Placeholder data for Payment Method and History
  const [paymentInfo] = useState({
    method: 'Cartão de crédito',
    details: 'Mastercard terminando em 4321'
  });

  const [paymentHistory] = useState([
    { month: 'Março 2024', plan: 'Plano Profissional', amount: '99,90', status: 'Pago' },
    { month: 'Fevereiro 2024', plan: 'Plano Profissional', amount: '99,90', status: 'Pago' },
    // Add more history items as needed
  ]);

  // Estados para as configurações de aparência
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: user?.theme || 'claro', // 'claro', 'escuro', 'sistema'
    primaryColor: user?.primary_color || 'verde', // 'verde', 'azul', 'roxo', 'laranja'
    layout: user?.layout || 'barraLateral' // 'barraLateral', 'barraSuperior'
  });

  // Update appearance settings state when user prop changes (e.g., after fetching profile)
  React.useEffect(() => {
    if (user) {
      setAppearanceSettings({
        theme: user.theme || 'claro',
        primaryColor: user.primary_color || 'verde',
        layout: user.layout || 'barraLateral',
      });
    }
  }, [user]);


  // Função para salvar alterações
  const handleSave = async () => {
    setLoading(true);

    try {
      if (activeTab === 'perfil') {
        // Atualizar o perfil do usuário no Supabase
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            email: profileData.email,
            avatar_url: profileData.avatar,
            bio: profileData.bio
          })
          .eq('id', user?.id);

        if (error) {
          console.error('Erro ao atualizar o perfil:', error);
          toast.error('Erro ao salvar as configurações de perfil.');
          setLoading(false);
          return;
        }
        toast.success('Configurações de perfil salvas com sucesso!');

      } else if (activeTab === 'seguranca') {
        // Lógica para alterar senha
        if (securityData.newPassword !== securityData.confirmNewPassword) {
          toast.error('A nova senha e a confirmação não coincidem.');
          setLoading(false);
          return;
        }
        if (!securityData.newPassword) {
           toast.error('A nova senha não pode estar vazia.');
           setLoading(false);
           return;
        }

        // Supabase update user requires the new password directly
        // It does NOT require the current password for this specific method
        // The user must be authenticated to call this method
        const { data, error } = await supabase.auth.updateUser({
          password: securityData.newPassword
        });

        if (error) {
          console.error('Erro ao alterar senha:', error);
          // Handle specific Supabase auth errors if needed
          toast.error(`Erro ao alterar senha: ${error.message}`);
          setLoading(false);
          return;
        }

        toast.success('Senha alterada com sucesso!');
        // Clear password fields after successful update
        setSecurityData({
          ...securityData,
          currentPassword: '', // Note: current password is not used by updateUser, but clearing for UX
          newPassword: '',
          confirmNewPassword: ''
        });

      } else if (activeTab === 'aparencia') {
        // Lógica para salvar configurações de aparência no Supabase
        const { data, error } = await supabase
          .from('profiles')
          .update({
            theme: appearanceSettings.theme,
            primary_color: appearanceSettings.primaryColor,
            layout: appearanceSettings.layout,
          })
          .eq('id', user?.id);

        if (error) {
          console.error('Erro ao atualizar configurações de aparência:', error);
          toast.error('Erro ao salvar as configurações de aparência.');
          setLoading(false);
          return;
        }

        toast.success('Configurações de aparência salvas com sucesso!');
        // TODO: Trigger a global state update or refresh to apply the new settings visually
        // This will be handled in a subsequent step, likely involving AuthContext or a new AppearanceContext
      }
      // TODO: Implement saving for other tabs (notifications, etc.)

    } catch (error) {
      console.error('Erro geral ao salvar configurações:', error);
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setLoading(false);
    }
  };

  // Função para alterar plano
  const handleChangePlan = () => {
    navigate('/settings/plans'); // Navigate to the plan selection page
  };

  // Função para atualizar a foto de perfil
  const handleAvatarUpload = async (imageUrl: string) => {
    setProfileData({ ...profileData, avatar: imageUrl });
  };

  // Simple Toggle component (for visual representation)
  const Toggle = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );


  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e informações da conta</p>
      </div>

      {/* Navegação das configurações */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b flex overflow-x-auto">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'perfil' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('perfil')}
          >
            <User size={18} />
            Perfil
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'notificacoes' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('notificacoes')}
          >
            <Bell size={18} />
            Notificações
          </button>
           <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'seguranca' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('seguranca')}
          >
            <Shield size={18} />
            Segurança
          </button>
           <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'plano' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('plano')}
          >
            <CreditCard size={18} />
            Plano
          </button>
           <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'empresa' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('empresa')}
          >
            <Briefcase size={18} />
            Empresa
          </button>
           <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'aparencia' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('aparencia')}
          >
            <Layout size={18} />
            Aparência
          </button>
        </div>
      </div>

      {/* Conteúdo das configurações */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'perfil' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Informações do Perfil</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nome completo</label>
                <input
                  type="text"
                  className="input-field"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Telefone</label>
                <input
                  type="text"
                  className="input-field"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Foto do perfil</label>
                <div className="flex items-center gap-4">
                  <ImageUploader
                    onUpload={handleAvatarUpload}
                    currentAvatarUrl={profileData.avatar}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="label">Biografia</label>
              <textarea
                className="input-field min-h-[100px]"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>
          </div>
        )}

        {activeTab === 'notificacoes' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Preferências de Notificação</h2>

            {/* Notificações por Email */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Mail size={20} className="text-gray-600" />
                <h3 className="text-md font-medium text-gray-800">Notificações por Email</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Novos clientes</p>
                    <p className="text-sm text-gray-500">Receba notificações quando um novo cliente se cadastrar</p>
                  </div>
                   <Toggle
                    enabled={notifications.email.newClient}
                    onToggle={() => setNotifications({ ...notifications, email: { ...notifications.email, newClient: !notifications.email.newClient } })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Pagamentos</p>
                    <p className="text-sm text-gray-500">Notificações sobre pagamentos recebidos e pendentes</p>
                  </div>
                   <Toggle
                    enabled={notifications.email.payment}
                    onToggle={() => setNotifications({ ...notifications, email: { ...notifications.email, payment: !notifications.email.payment } })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Cancelamentos</p>
                    <p className="text-sm text-gray-500">Seja notificado quando um cliente cancelar um treino</p>
                  </div>
                   <Toggle
                    enabled={notifications.email.cancelation}
                    onToggle={() => setNotifications({ ...notifications, email: { ...notifications.email, cancelation: !notifications.email.cancelation } })}
                  />
                </div>
              </div>
            </div>

            {/* Notificações Push */}
            <div>
               <div className="flex items-center gap-2 mb-4">
                <Bell size={20} className="text-gray-600" />
                <h3 className="text-md font-medium text-gray-800">Notificações Push</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Novos clientes</p>
                    <p className="text-sm text-gray-500">Receba notificações quando um novo cliente se cadastrar</p>
                  </div>
                   <Toggle
                    enabled={notifications.push.newClient}
                    onToggle={() => setNotifications({ ...notifications, push: { ...notifications.push, newClient: !notifications.push.newClient } })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Pagamentos</p>
                    <p className="text-sm text-gray-500">Notificações sobre pagamentos recebidos e pendentes</p>
                  </div>
                   <Toggle
                    enabled={notifications.push.payment}
                    onToggle={() => setNotifications({ ...notifications, push: { ...notifications.push, payment: !notifications.push.payment } })}
                  />
                </div>
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Lembretes</p>
                    <p className="text-sm text-gray-500">Receba lembretes de treinos e compromissos</p>
                  </div>
                   <Toggle
                    enabled={notifications.push.reminder}
                    onToggle={() => setNotifications({ ...notifications, push: { ...notifications.push, reminder: !notifications.push.reminder } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Segurança da Conta</h2>

            {/* Alterar Senha */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Senha atual</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Digite sua senha atual"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Nova senha</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Digite a nova senha"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Confirmar nova senha</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirme a nova senha"
                    value={securityData.confirmNewPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmNewPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Verificação em Duas Etapas */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Verificação em Duas Etapas</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Autenticação em dois fatores</p>
                  <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                </div>
                <button className="btn-outline">Configurar</button>
              </div>
            </div>

            {/* Sessões Ativas */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-4">Sessões Ativas</h3>
              <div className="space-y-4">
                {securityData.activeSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-700">{session.device}</p>
                      <p className="text-sm text-gray-500">{session.location} • {session.status}</p>
                    </div>
                    <button className="text-red-600 hover:underline text-sm">Encerrar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plano' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Seu Plano</h2>

            {/* Current Plan Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{planInfo.currentPlan}</h3>
                <p className="text-gray-600 mb-4">Até {planInfo.clientsLimit} clientes</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-1">Clientes utilizados: {planInfo.clientsCount}/{planInfo.clientsLimit}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${(planInfo.clientsCount / planInfo.clientsLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Próxima cobrança em {planInfo.nextBilling}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                 <p className="text-xl font-bold text-gray-800 mb-4">R$ {planInfo.price}/mês</p>
                 <button className="btn-primary" onClick={handleChangePlan}>
                   Alterar plano
                 </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-gray-600" />
                Método de Pagamento
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">{paymentInfo.method}</p>
                  <p className="text-sm text-gray-500">{paymentInfo.details}</p>
                </div>
                <button className="text-primary hover:underline text-sm">Alterar</button> {/* Placeholder button */}
              </div>
            </div>

            {/* Payment History */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <Calendar size={20} className="text-gray-600" />
                Histórico de Pagamentos
              </h3>
              <div className="space-y-4">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{payment.month}</p>
                      <p className="text-sm text-gray-500">{payment.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-700">R$ {payment.amount}</p>
                      <span className="text-sm text-green-600 font-semibold">{payment.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'empresa' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Informações da Empresa</h2>
             <p className="text-gray-600">Conteúdo da aba Empresa...</p>
             {/* TODO: Implement company information UI */}
          </div>
        )}

        {activeTab === 'aparencia' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Personalização</h2>

            {/* Tema */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Tema</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tema Claro */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${appearanceSettings.theme === 'claro' ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'claro' })}
                >
                  <div className="w-full h-24 bg-white border border-gray-200 rounded-md mb-3"></div> {/* Placeholder visual */}
                  <p className="font-medium text-gray-700">Claro</p>
                  <p className="text-sm text-gray-500">Tema padrão claro</p>
                </div>
                {/* Tema Escuro */}
                <div
                   className={`border rounded-lg p-4 cursor-pointer ${appearanceSettings.theme === 'escuro' ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                   onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'escuro' })}
                >
                   <div className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md mb-3"></div> {/* Placeholder visual */}
                   <p className="font-medium text-gray-700">Escuro</p>
                   <p className="text-sm text-gray-500">Tema escuro</p>
                </div>
                {/* Tema Sistema */}
                <div
                   className={`border rounded-lg p-4 cursor-pointer ${appearanceSettings.theme === 'sistema' ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                   onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'sistema' })}
                >
                   <div className="w-full h-24 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-md mb-3"></div> {/* Placeholder visual */}
                   <p className="font-medium text-gray-700">Sistema</p>
                   <p className="text-sm text-gray-500">Segue as configurações do sistema</p>
                </div>
              </div>
            </div>

            {/* Cor principal */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Cor principal</h3>
              <div className="flex gap-4">
                {/* Verde */}
                <div
                  className={`w-12 h-12 rounded-full cursor-pointer bg-green-500 flex items-center justify-center ${appearanceSettings.primaryColor === 'verde' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: 'verde' })}
                >
                   {appearanceSettings.primaryColor === 'verde' && <X size={24} className="text-white" />} {/* Checkmark or X for selection */}
                </div>
                 {/* Azul */}
                <div
                  className={`w-12 h-12 rounded-full cursor-pointer bg-blue-500 flex items-center justify-center ${appearanceSettings.primaryColor === 'azul' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: 'azul' })}
                >
                   {appearanceSettings.primaryColor === 'azul' && <X size={24} className="text-white" />}
                </div>
                 {/* Roxo */}
                <div
                  className={`w-12 h-12 rounded-full cursor-pointer bg-purple-500 flex items-center justify-center ${appearanceSettings.primaryColor === 'roxo' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: 'roxo' })}
                >
                   {appearanceSettings.primaryColor === 'roxo' && <X size={24} className="text-white" />}
                </div>
                 {/* Laranja */}
                <div
                  className={`w-12 h-12 rounded-full cursor-pointer bg-orange-500 flex items-center justify-center ${appearanceSettings.primaryColor === 'laranja' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
                  onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: 'laranja' })}
                >
                   {appearanceSettings.primaryColor === 'laranja' && <X size={24} className="text-white" />}
                </div>
              </div>
            </div>

            {/* Layout */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-4">Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Barra Lateral */}
                <div
                   className={`border rounded-lg p-4 cursor-pointer ${appearanceSettings.layout === 'barraLateral' ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                   onClick={() => setAppearanceSettings({ ...appearanceSettings, layout: 'barraLateral' })}
                >
                   <div className="w-full h-24 flex gap-2 rounded-md mb-3">
                     <div className="w-1/4 bg-gray-200 rounded-l-md"></div> {/* Sidebar placeholder */}
                     <div className="w-3/4 bg-gray-100 rounded-r-md"></div> {/* Content placeholder */}
                   </div>
                   <p className="font-medium text-gray-700">Barra lateral</p>
                   <p className="text-sm text-gray-500">Menu na lateral esquerda</p>
                </div>
                {/* Barra Superior */}
                <div
                   className={`border rounded-lg p-4 cursor-pointer ${appearanceSettings.layout === 'barraSuperior' ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                   onClick={() => setAppearanceSettings({ ...appearanceSettings, layout: 'barraSuperior' })}
                >
                   <div className="w-full h-24 flex flex-col gap-2 rounded-md mb-3">
                     <div className="h-1/4 bg-gray-200 rounded-t-md"></div> {/* Top bar placeholder */}
                     <div className="h-3/4 bg-gray-100 rounded-b-md"></div> {/* Content placeholder */}
                   </div>
                   <p className="font-medium text-gray-700">Barra superior</p>
                   <p className="text-sm text-gray-500">Menu no topo da página</p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Botões de ação */}
        {/* These buttons are only relevant for tabs where changes are saved directly (like Perfil, Segurança, Notificações, Aparência) */}
        {activeTab !== 'plano' && (
           <div className="mt-8 flex justify-end gap-4 pt-6 border-t">
            <button
              className="btn-outline flex items-center gap-1"
              onClick={() => toast.error('Alterações descartadas!')}
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              className="btn-primary flex items-center gap-1"
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
