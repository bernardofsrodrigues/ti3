import React, { useEffect, useState } from 'react';
import { Users, Syringe, Baby, Scale } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/dashboard/LineChart';
import BarChart from '@/components/dashboard/BarChart';
import PieChart from '@/components/dashboard/PieChart';
import CalendarEvents from '@/components/dashboard/CalendarEvents';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await fetch('http://localhost:8000/api/dashboard/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const formatMes = (mes: string) => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses[parseInt(mes, 10) - 1] || mes;
  };

  const pesoData = dashboardData?.evolucao_peso?.map((item: any) => ({
    name: formatMes(item.mes),
    value: item.avg,
  })) || [];

  const nascimentoData = dashboardData?.nascimentos_por_mes?.map((item: any) => ({
    name: formatMes(item.mes),
    value: item.total,
  })) || [];

  const taxaNatalidadeAnos = dashboardData?.taxa_natalidade_anos?.map((item: any) => ({
    name: item.ano,
    value: item.taxa,
  })) || [];

  const racaData = dashboardData?.distribuicao_raca?.map((item: any, idx: number) => ({
    name: item.breed,
    value: item.total,
    color: ['#2D6A4F', '#40916C', '#D4A373', '#95D5B2', '#E9EDC9'][idx % 5],
  })) || [];

  const eventos = dashboardData?.eventos || [];

  const eventosConvertidos = eventos.map((e: any) => ({
    ...e,
    date: new Date(e.date),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total de Animais" value={dashboardData?.total_animais || '...'} icon={<Users size={18} />} description="Última contagem" />
        <StatCard title="Peso Médio" value={dashboardData ? `${dashboardData.peso_medio} kg` : '...'} icon={<Scale size={18} />} description="Últimos 30 dias" />
        <StatCard title="Taxa de Natalidade" value={dashboardData ? `${dashboardData.taxa_natalidade}%` : '...'} icon={<Baby size={18} />} description="Este ano" />
        <StatCard title="Vacinas Pendentes" value={dashboardData?.vacinas_pendentes || '...'} icon={<Syringe size={18} />} description="Próximos 15 dias" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LineChart title="Evolução do Peso Médio (kg)" data={pesoData} dataKey="value" stroke="#40916C" />
        <BarChart title="Nascimentos por Mês" data={nascimentoData} dataKey="value" fill="#D4A373" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PieChart title="Distribuição por Raça" data={racaData} className="md:col-span-1" />
        <BarChart title="Taxa de Natalidade por Ano" data={taxaNatalidadeAnos} dataKey="value" fill="#2D6A4F" className="md:col-span-2" />
      </div>

      <CalendarEvents events={eventosConvertidos} />
    </div>
  );
};

export default Dashboard;
