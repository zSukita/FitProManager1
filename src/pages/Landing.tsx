import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Users,
  BarChart3,
  Calendar,
  CheckCircle,
  ArrowRight,
  LogIn
} from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-md">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitProManager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-gray-600 hover:text-primary transition-colors">
              Login
            </Link>
            <Link 
              to="/auth/register" 
              className="btn-primary flex items-center gap-2"
            >
              <LogIn size={18} />
              <span>Criar Conta</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Gerencie seu <span className="text-primary">negócio fitness</span> com eficiência e profissionalismo
            </h1>
            <p className="text-lg text-gray-600">
              A solução completa para treinadores e gestores de academias. Controle clientes, treinos, finanças e muito mais em uma única plataforma intuitiva e poderosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/register" className="btn-primary flex items-center justify-center gap-2">
                <span>Começar Agora</span>
                <ArrowRight size={18} />
              </Link>
              <button className="btn-outline flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                <span>Ver Tour</span>
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {['https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', 
                  'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
                  'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg'].map((src, i) => (
                  <img 
                    key={i}
                    src={src} 
                    alt="User" 
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-primary">1,200+</span> profissionais já utilizam
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-full opacity-20 blur-3xl"></div>
            <img 
              src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Fitness Dashboard" 
              className="rounded-xl shadow-lg border border-gray-100 relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Tudo que você precisa em uma única plataforma</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para gerenciar seu negócio fitness de forma eficiente e moderna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={24} />,
                title: "Gestão de Clientes",
                description: "Cadastre, organize e acompanhe o progresso de seus clientes com facilidade e segurança"
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Controle Financeiro",
                description: "Gerencie pagamentos, planos e faturamento com relatórios em tempo real"
              },
              {
                icon: <Calendar size={24} />,
                title: "Agendamento Inteligente",
                description: "Organize treinos, consultas e horários com um sistema de agendamento intuitivo"
              }
            ].map((feature, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-all">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">O que nossos usuários dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja como o FitProManager está transformando a gestão de negócios fitness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Ana Silva",
                role: "Personal Trainer",
                content: "Desde que comecei a usar o FitProManager, minha produtividade aumentou em 70%. A interface intuitiva e as ferramentas de acompanhamento são incríveis.",
                avatar: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                name: "Carlos Mendes",
                role: "Gestor de Academia",
                content: "O controle financeiro e o gerenciamento de clientes são as melhores ferramentas que já utilizei. Recomendo para qualquer negócio do setor.",
                avatar: "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
            ].map((testimonial, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para transformar seu negócio fitness?</h2>
          <p className="text-lg mb-8 opacity-90">Experimente o FitProManager gratuitamente por 14 dias</p>
          <Link to="/auth/register" className="btn-primary bg-white text-primary hover:bg-gray-50 transition-colors">
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-primary">Recursos</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Preços</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Documentação</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-primary">Sobre</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Blog</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-primary">Ajuda</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Contato</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-primary">Termos</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Privacidade</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-500">
            <p>© 2023 FitProManager. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
