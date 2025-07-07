
import React, { useState } from 'react';
import { Download, FileText, Filter, ChevronDown, Calendar as CalendarIcon} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BarChart from '@/components/dashboard/BarChart';
import PieChart from '@/components/dashboard/PieChart';

// Dados simulados para relatórios
const reportTypes = [
  { id: 'animals', name: 'Inventário de Animais' },
  { id: 'weights', name: 'Evolução de Peso' },
  { id: 'vaccinations', name: 'Vacinações' },
  { id: 'births', name: 'Nascimentos' },
  { id: 'pastures', name: 'Ocupação de Pastagens' },
  { id: 'financial', name: 'Financeiro' },
];

// Dados para os gráficos
const weightProgressData = [
  { name: 'Jan', bezerros: 160, novilhos: 320, adultos: 520 },
  { name: 'Fev', bezerros: 170, novilhos: 330, adultos: 525 },
  { name: 'Mar', bezerros: 180, novilhos: 340, adultos: 530 },
  { name: 'Abr', bezerros: 190, novilhos: 350, adultos: 535 },
  { name: 'Mai', bezerros: 200, novilhos: 360, adultos: 540 },
  { name: 'Jun', bezerros: 210, novilhos: 370, adultos: 545 },
];

const animalDistribution = [
  { name: 'Vacas', value: 45 },
  { name: 'Touros', value: 5 },
  { name: 'Novilhas', value: 20 },
  { name: 'Bezerros', value: 30 },
];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('animals');

  return (
    <div className="mt-16 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Geração e análise de relatórios do rebanho</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="whitespace-nowrap">
            <FileText className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>Configure e gere relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Período</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Data inicial</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Data final</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Filtros</label>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Aplicar Filtros</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button>Gerar Relatório</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Peso</CardTitle>
            <CardDescription>Ganho de peso por categoria no último semestre</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart
              title="Bezerros no semestre"
              data={weightProgressData}
              height={300}
              dataKey="bezerros"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Rebanho</CardTitle>
            <CardDescription>Composição atual do rebanho por categoria</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <PieChart 
                title="Distribuição do Rebanho"
                data={animalDistribution}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
          <CardDescription>Acesse rapidamente os relatórios gerados recentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportTypes.slice(0, 4).map((report, index) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-md">
                    <FileText className="h-5 w-5 text-cattle-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">Gerado em {format(new Date(2024, 2, 10 - index), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
