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
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inicialize useNavigate

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
  const handleSave = () => {
    setLoading(true);

    // Simulando uma requisição
    setTimeout(() => {
      setLoading(false);
      toast.success('Configurações salvas com sucesso!');
    }, 1000);
  };

  // Função para alterar plano
  const handleChangePlan = () => {
    navigate('/settings/plans'); // Navega para a nova página de planos
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
            <Lock size={18} />
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
            <Building2 size={18} />
            Empresa
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'aparencia' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('aparencia')}
          >
            <Palette size={18} />
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
                  <img
                    src={profileData.avatar || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button className="btn-outline">
                    Alterar foto
                  </button>
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

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Mail size={18} />
                  Notificações por Email
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novos clientes</p>
                      <p className="text-sm text-gray-500">Receba notificações quando um novo cliente se cadastrar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.email.newClient}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          email: { ...notifications.email, newClient: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pagamentos</p>
                      <p className="text-sm text-gray-500">Notificações sobre pagamentos recebidos e pendentes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.email.payment}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          email: { ...notifications.email, payment: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cancelamentos</p>
                      <p className="text-sm text-gray-500">Seja notificado quando um cliente cancelar um treino</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.email.cancelation}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          email: { ...notifications.email, cancelation: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Bell size={18} />
                  Notificações Push
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novos clientes</p>
                      <p className="text-sm text-gray-500">Receba notificações quando um novo cliente se cadastrar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.push.newClient}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          push: { ...notifications.push, newClient: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pagamentos</p>
                      <p className="text-sm text-gray-500">Notificações sobre pagamentos recebidos e pendentes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.push.payment}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          push: { ...notifications.push, payment: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lembretes</p>
                      <p className="text-sm text-gray-500">Receba lembretes de treinos e compromissos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.push.reminder}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          push: { ...notifications.push, reminder: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Segurança da Conta</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Alterar Senha</h3>

                <div className="space-y-4">
                  <div>
                    <label className="label">Senha atual</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div>
                    <label className="label">Nova senha</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Digite a nova senha"
                    />
                  </div>

                  <div>
                    <label className="label">Confirmar nova senha</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Verificação em Duas Etapas</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação em dois fatores</p>
                    <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <button className="btn-outline">
                    Configurar
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Sessões Ativas</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Chrome - Windows</p>
                      <p className="text-sm text-gray-500">São Paulo, Brasil • Ativo agora</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Encerrar
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Safari - iPhone</p>
                      <p className="text-sm text-gray-500">São Paulo, Brasil • 2 horas atrás</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Encerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plano' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Seu Plano</h2>

            <div className="bg-gray-50 border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold capitalize">{planInfo.currentPlan}</h3>
                  <p className="text-gray-600">Até {planInfo.clientsLimit} clientes</p>
                </div>
                <span className="text-2xl font-bold">{planInfo.price}/mês</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Clientes utilizados</span>
                  <span className="font-medium">{planInfo.clientsCount}/{planInfo.clientsLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(planInfo.clientsCount / planInfo.clientsLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Próxima cobrança em {new Date(planInfo.nextBilling).toLocaleDateString('pt-BR')}
                </p>
                <button
                  className="btn-primary"
                  onClick={handleChangePlan} // Adicionado manipulador de clique
                >
                  Alterar plano
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Método de Pagamento</h3>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Cartão de crédito</p>
                      <p className="text-sm text-gray-500">Mastercard terminando em 4321</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm">
                    Alterar
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Histórico de Pagamentos</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Março 2024</p>
                      <p className="text-sm text-gray-500">Plano Profissional</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 99,90</p>
                      <p className="text-sm text-green-600">Pago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Fevereiro 2024</p>
                      <p className="text-sm text-gray-500">Plano Profissional</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 99,90</p>
                      <p className="text-sm text-green-600">Pago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'empresa' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Informações da Empresa</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nome da empresa</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome da sua empresa ou estúdio"
                />
              </div>

              <div>
                <label className="label">CNPJ</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="label">Endereço</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <label className="label">Cidade/Estado</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Cidade - UF"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="label">Logo da empresa</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <button className="btn-outline">
                  Fazer upload
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="label">Descrição da empresa</label>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Descreva sua empresa ou estúdio"
              />
            </div>
          </div>
        )}

        {activeTab === 'aparencia' && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Personalização</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Tema</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-20 bg-white rounded mb-2"></div>
                    <p className="font-medium">Claro</p>
                    <p className="text-sm text-gray-500">Tema padrão claro</p>
                  </div>

                  <div className="border p-4 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-20 bg-gray-900 rounded mb-2"></div>
                    <p className="font-medium">Escuro</p>
                    <p className="text-sm text-gray-500">Tema escuro</p>
                  </div>

                  <div className="border p-4 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2"></div>
                    <p className="font-medium">Sistema</p>
                    <p className="text-sm text-gray-500">Segue as configurações do sistema</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Cor principal</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-12 bg-primary rounded-lg cursor-pointer"></div>
                    <p className="text-sm font-medium text-center">Verde</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 bg-blue-500 rounded-lg cursor-pointer"></div>
                    <p className="text-sm font-medium text-center">Azul</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 bg-purple-500 rounded-lg cursor-pointer"></div>
                    <p className="text-sm font-medium text-center">Roxo</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-12 bg-orange-500 rounded-lg cursor-pointer"></div>
                    <p className="text-sm font-medium text-center">Laranja</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Layout</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-32 bg-gray-100 rounded mb-2 flex">
                      <div className="w-1/4 bg-gray-200"></div>
                      <div className="flex-1 p-2">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <p className="font-medium">Barra lateral</p>
                    <p className="text-sm text-gray-500">Menu na lateral esquerda</p>
                  </div>

                  <div className="border p-4 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-32 bg-gray-100 rounded mb-2">
                      <div className="h-8 bg-gray-200"></div>
                      <div className="p-2">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <p className="font-medium">Barra superior</p>
                    <p className="text-sm text-gray-500">Menu no topo da página</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
