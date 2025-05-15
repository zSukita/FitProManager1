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
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader'; // Importe o componente ImageUploader
import { supabase } from '../lib/supabase'; // Importe o cliente Supabase

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estados para as configurações do perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999',
    bio: 'Personal Trainer especializado em hipertrofia e emagrecimento',
    avatar: user?.avatar || ''
  });

  // Estados para as configurações de notificação
  const [notifications, setNotifications] = useState({
    email: {
      newClient: true,
      payment: true,
      cancelation: true,
      reminder: false
    },
    push: {
      newClient: true,
      payment: true,
      cancelation: true,
      reminder: true
    }
  });

  // Estados para as configurações de plano
  const [planInfo] = useState({
    currentPlan: user?.plan || 'profissional',
    clientsLimit: 50,
    clientsCount: 22,
    nextBilling: '2024-04-15',
    price: 'R$ 99,90'
  });

  // Função para salvar alterações
  const handleSave = async () => {
    setLoading(true);

    try {
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
        toast.error('Erro ao salvar as configurações.');
        setLoading(false);
        return;
      }

      // Atualizar o estado local do usuário
      // (Opcional: você pode buscar os dados atualizados do Supabase)
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar as configurações:', error);
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setLoading(false);
    }
  };

  // Função para alterar plano
  const handleChangePlan = () => {
    navigate('/settings/plans');
  };

  // Função para atualizar a foto de perfil
  const handleAvatarUpload = async (imageUrl: string) => {
    setProfileData({ ...profileData, avatar: imageUrl });
  };

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
          {/* Outros botões de navegação */}
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

        {/* Outros conteúdos das configurações */}

        {/* Botões de ação */}
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
      </div>
    </div>
  );
};

export default Settings;
