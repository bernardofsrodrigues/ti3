import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart2, FileText, Beef, Syringe, Weight, Baby, PieChart, Users, ShieldCheck } from 'lucide-react';

const Presentation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const tipoUsuario = localStorage.getItem('tipo_usuario');
  const isAdminSistema = token && tipoUsuario === 'admin_sistema';
  const isAdminFazenda = token && tipoUsuario === 'admin_fazenda';
  const isLogado = token && isAdminFazenda;

  const [dashboardResumo, setDashboardResumo] = useState<any>(null);

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/dashboard/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDashboardResumo(data);
      } catch (error) {
        console.error('Erro ao buscar resumo da fazenda:', error);
      }
    };

    if (isLogado) {
      fetchResumo();
    }
  }, [isLogado, token]);
  
  const features = [
    { 
      icon: <Beef  />, 
      title: "Controle de Animais", 
      description: "Gerencie seu rebanho com informações detalhadas sobre cada animal, incluindo identificação, raça, idade e histórico completo." 
    },
    { 
      icon: <Weight />, 
      title: "Pesagens", 
      description: "Acompanhe o desenvolvimento do seu rebanho com registro de pesagens periódicas e gráficos de evolução." 
    },
    { 
      icon: <Syringe />, 
      title: "Vacinação", 
      description: "Mantenha o controle sanitário do seu rebanho com calendário de vacinação, alertas e histórico completo." 
    },
    { 
      icon: <Baby />, 
      title: "Reprodução", 
      description: "Gerencie o ciclo reprodutivo do seu rebanho, com controle de coberturas, gestações e nascimentos." 
    },
    { 
      icon: <PieChart />, 
      title: "Pastagens", 
      description: "Otimize a utilização das pastagens com rotação inteligente e monitoramento da capacidade de suporte." 
    },
    { 
      icon: <FileText />, 
      title: "Relatórios", 
      description: "Acesse relatórios gerenciais detalhados para tomada de decisões estratégicas sobre seu rebanho." 
    },
  ];
  
  const news = [
    {
      date: "05/05/2025",
      title: "Nova atualização disponível",
      description: "Versão 2.5 traz melhorias no módulo de reprodução e novas funcionalidades no dashboard."
    },
    {
      date: "28/04/2025",
      title: "Webinar: Gestão eficiente de rebanho",
      description: "Participe do nosso webinar gratuito sobre as melhores práticas de gestão de rebanho bovino."
    },
    {
      date: "15/04/2025",
      title: "Integração com balanças digitais",
      description: "Agora é possível integrar balanças digitais para registro automático de pesagens."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/20 to-background pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-primary">Fazenda</span>Inteligente
              </h1>
              <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">
                Gerenciamento de Rebanhos Inteligente
              </p>
              <p className="text-base md:text-lg mb-8 max-w-md">
                Um sistema completo para gestão de rebanho bovino, com interface moderna, experiência de usuário fluida e arquitetura eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    if (!token) return navigate('/login');
                  
                    switch (tipoUsuario) {
                      case 'admin_sistema':
                        navigate('/painel-controle');
                        break;
                      case 'admin_fazenda':
                        navigate('/dashboard');
                        break;
                      case 'veterinario':
                      case 'funcionario':
                        navigate('/animals');
                        break;
                      default:
                        navigate('/login');
                        break;
                    }
                  }}
                  size="lg"
                  className="font-medium"
                >
                  {token ? 'Acessar Sistema' : 'Entrar'} <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              {isLogado && dashboardResumo && (
                <Card className="w-full max-w-md shadow-lg border-border/50 bg-gradient-to-br from-card to-card/90">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="text-primary" />
                      Dashboard Gerencial
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="dashboard-stat">
                        <p className="text-sm text-muted-foreground">Total de Animais</p>
                        <p className="text-2xl font-bold">{dashboardResumo.total_animais}</p>
                      </div>
                      <div className="dashboard-stat">
                        <p className="text-sm text-muted-foreground">Vacinações Pendentes</p>
                        <p className="text-2xl font-bold">{dashboardResumo.vacinas_pendentes}</p>
                      </div>
                      <div className="dashboard-stat">
                        <p className="text-sm text-muted-foreground">Peso Médio</p>
                        <p className="text-2xl font-bold">{dashboardResumo.peso_medio} kg</p>
                      </div>
                      <div className="dashboard-stat">
                        <p className="text-sm text-muted-foreground">Nascimentos este mês</p>
                        <p className="text-2xl font-bold">
                          {dashboardResumo.nascimentos_por_mes?.find((n: any) => n.mes === new Date().toISOString().slice(5, 7))?.total || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Funcionalidades Principais
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="cattle-card hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Acesso Seguro com Diferentes Papéis
          </h2>
          
          <Tabs defaultValue="admin" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="vet">Veterinário</TabsTrigger>
              <TabsTrigger value="cowboy">Vaqueiro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Users className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Administrador</h3>
                  <p className="text-muted-foreground mb-4">
                    Acesso completo ao sistema com funcionalidades de gerenciamento de usuários, 
                    configurações avançadas e exportação de dados para análise estratégica.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Gerenciamento de permissões</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Configurações financeiras</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Relatórios avançados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vet" className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Syringe className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Veterinário</h3>
                  <p className="text-muted-foreground mb-4">
                    Foco em saúde animal com acesso ao gerenciamento de vacinações, 
                    tratamentos e histórico médico de cada animal do rebanho.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Gestão de vacinações</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Registro de tratamentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Histórico sanitário</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cowboy" className="p-4 bg-card rounded-lg border border-border shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Beef className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Vaqueiro</h3>
                  <p className="text-muted-foreground mb-4">
                    Interface simplificada para registro de atividades diárias, 
                    como pesagens, movimentações e observações sobre o rebanho.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Registro de pesagens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Controle de pastagens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Observações de rotina</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Notícias e Atualizações
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <Card key={index} className="cattle-card">
                <CardHeader className="pb-2">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <CardTitle className="text-xl mt-1">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            © 2025 Fazenda Inteligente - Sistema de Gestão de Rebanho
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Presentation;
