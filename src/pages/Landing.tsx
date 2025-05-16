import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Users, BarChart3, Clock, CreditCard, TrendingUp, Share2, CalendarDays } from 'lucide-react'; // Importando mais ícones

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FitProManager</span>
        </div>
        <div>
          <Link
            to="/auth/login"
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Acessar Sistema
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Gerencie seus <span className="text-primary">alunos</span> e <br className="hidden md:inline"/>
            <span className="text-primary">treinos</span> de forma simples
          </h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 lg:mx-0">
            Sistema de gestão completo para personal trainers. Diga adeus às planilhas e WhatsApp.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
            <Link
              to="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:px-10 md:text-lg"
            >
              Começar Agora
            </Link>
            <Link
              to="#" // Placeholder para demonstração
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
            >
              Ver Demonstração
            </Link>
          </div>
          {/* Statistics Placeholder */}
          <div className="mt-12 flex justify-center lg:justify-start gap-8 text-gray-700">
            <div>
              <p className="text-2xl font-bold text-primary">+100</p>
              <p className="text-sm">Personal Trainers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">+2500</p>
              <p className="text-sm">Alunos Gerenciados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">+5000</p>
              <p className="text-sm">Treinos Criados</p>
            </div>
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Exemplo de imagem do Pexels
            alt="Personal trainer helping a client"
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tudo o que você precisa em um só lugar
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Criação de Treinos</h3>
              <p className="mt-2 text-base text-gray-600">
                Monte treinos personalizados para seus alunos em minutos com nossa biblioteca de exercícios.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Gestão de Alunos</h3>
              <p className="mt-2 text-base text-gray-600">
                Gerencie seus alunos de forma eficiente com fichas completas e histórico de treinos.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Compartilhamento</h3>
              <p className="mt-2 text-base text-gray-600">
                Compartilhe treinos diretamente com seus alunos via WhatsApp, e-mail ou link.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <CalendarDays size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Controle de Horários</h3>
              <p className="mt-2 text-base text-gray-600">
                Gerencie sua agenda de forma simples e evite conflitos de horários.
              </p>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Gestão de Pagamentos</h3>
              <p className="mt-2 text-base text-gray-600">
                Registre pagamentos de mensalidades e serviços extras para manter seu fluxo de caixa organizado.
              </p>
            </div>
            {/* Feature Card 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Acompanhamento de Progresso</h3>
              <p className="mt-2 text-base text-gray-600">
                Monitore a evolução de seus alunos com gráficos e medições ao longo do tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-primary p-1.5 rounded-md">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">FitProManager</span>
          </div>
          <p className="text-sm">&copy; 2025 FitProManager. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
