
import React from 'react';
import { Plus, Download, Calendar as CalendarIcon, Heart, User, BellDot, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { differenceInCalendarDays } from "date-fns";

// Dados simulados para reprodução
const inseminationData = [
  { id: 1, animal: 'BOV-2023-0045', name: 'Mimosa', date: new Date(2024, 1, 15), bull: 'Touro A', status: 'Confirmada', expectedBirth: new Date(2024, 10, 25) },
  { id: 2, animal: 'BOV-2023-0089', name: 'Estrela', date: new Date(2024, 1, 20), bull: 'Touro B', status: 'Confirmada', expectedBirth: new Date(2024, 10, 30) },
  { id: 3, animal: 'BOV-2022-0113', name: 'Bonita', date: new Date(2024, 2, 5), bull: 'Touro A', status: 'Aguardando', expectedBirth: new Date(2024, 11, 15) },
];

const birthsData = [
  { id: 1, mother: 'BOV-2021-0034', motherName: 'Beleza', father: 'Touro A', date: new Date(2024, 0, 10), offspring: 2, calves: ['BOV-2024-0001', 'BOV-2024-0002'] },
  { id: 2, mother: 'BOV-2020-0015', motherName: 'Aurora', father: 'Touro C', date: new Date(2024, 1, 5), offspring: 1, calves: ['BOV-2024-0010'] },
];

const upcomingBirths = [
  { id: 1, animal: 'BOV-2023-0045', name: 'Mimosa', expectedDate: new Date(2024, 10, 25), daysLeft: 225, progress: 30 },
  { id: 2, animal: 'BOV-2023-0089', name: 'Estrela', expectedDate: new Date(2024, 10, 30), daysLeft: 230, progress: 28 },
  { id: 3, animal: 'BOV-2023-0027', name: 'Aurora', expectedDate: new Date(2024, 6, 15), daysLeft: 90, progress: 67 },
  { id: 4, animal: 'BOV-2022-0067', name: 'Violeta', expectedDate: new Date(2024, 5, 10), daysLeft: 55, progress: 80 },
];

const Reproduction = () => {
  const [inseminationModalOpen, setInseminationModalOpen] = React.useState(false);
  const [inseminationData, setInseminationData] = React.useState([]);

  const [inseminationForm, setInseminationForm] = React.useState({
    animal: '',
    name: '',
    date: '',
    bull: '',
    expectedBirth: '',
    status: 'Confirmada',
  });



const today = new Date();

const proximasInseminacoes = inseminationData.filter((item) => {
  return new Date(item.expectedBirth) > today;
});

const partoMaisProximo = proximasInseminacoes.reduce((maisProximo, atual) => {
  const diasAtual = differenceInCalendarDays(new Date(atual.expectedBirth), today);
  const diasMaisProximo = maisProximo
    ? differenceInCalendarDays(new Date(maisProximo.expectedBirth), today)
    : Infinity;
  return diasAtual < diasMaisProximo ? atual : maisProximo;
}, null);

const diasRestantes = partoMaisProximo
  ? differenceInCalendarDays(new Date(partoMaisProximo.expectedBirth), today)
  : null;

const upcomingBirths = inseminationData
  .filter((item) => new Date(item.expectedBirth) > today)
  .map((item) => {
    const expectedDate = new Date(item.expectedBirth);
    const daysLeft = differenceInDays(expectedDate, today);
    const gestacaoTotal = 285; // duração média da gestação bovina em dias
    const progress = Math.min(100, Math.round(((gestacaoTotal - daysLeft) / gestacaoTotal) * 100));

    return {
      id: item.id,
      animal: item.animal,
      name: item.name,
      expectedDate,
      daysLeft,
      progress,
    };
  })
  .sort((a, b) => a.daysLeft - b.daysLeft); // ordenar por proximidade do parto


  return (
    <div className="mt-16 space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reprodução</h1>
          <p className="text-muted-foreground">Gestão reprodutiva do rebanho</p>
        </div>

        {/* Ações */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={inseminationModalOpen} onOpenChange={setInseminationModalOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Nova Inseminação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Inseminação</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* Formulário */}
                <div className="grid gap-1">
                  <Label>ID do Animal *</Label>
                  <Input
                    placeholder="Ex: BOV-2023-0045"
                    value={inseminationForm.animal}
                    onChange={(e) => setInseminationForm(f => ({ ...f, animal: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Nome do Animal *</Label>
                  <Input
                    placeholder="Ex: Mimosa"
                    value={inseminationForm.name}
                    onChange={(e) => setInseminationForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Data da Inseminação *</Label>
                  <Input
                    type="date"
                    value={inseminationForm.date}
                    onChange={(e) => setInseminationForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Nome do Touro *</Label>
                  <Input
                    placeholder="Ex: Touro A"
                    value={inseminationForm.bull}
                    onChange={(e) => setInseminationForm(f => ({ ...f, bull: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Nascimento Previsto *</Label>
                  <Input
                    type="date"
                    value={inseminationForm.expectedBirth}
                    onChange={(e) => setInseminationForm(f => ({ ...f, expectedBirth: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Status *</Label>
                  <Select
                    value={inseminationForm.status}
                    onValueChange={(val) => setInseminationForm(f => ({ ...f, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confirmada">Confirmada</SelectItem>
                      <SelectItem value="Aguardando">Aguardando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                <Button
  onClick={() => {
    const isValid = Object.values(inseminationForm).every(v => v.trim() !== '');
    if (!isValid) return alert('Preencha todos os campos corretamente.');

    const newEntry = {
      id: Date.now(), // ID único
      animal: inseminationForm.animal,
      name: inseminationForm.name,
      date: new Date(inseminationForm.date),
      bull: inseminationForm.bull,
      expectedBirth: new Date(inseminationForm.expectedBirth),
      status: inseminationForm.status,
    };

    setInseminationData(prev => [...prev, newEntry]); // adiciona à tabela

    setInseminationModalOpen(false);
    setInseminationForm({
      animal: '',
      name: '',
      date: '',
      bull: '',
      expectedBirth: '',
      status: 'Confirmada',
    });
  }}
>
  Salvar
</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inseminações (Mês)</CardTitle>
            <Heart className="h-4 w-4 text-cattle-primary" />
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">{inseminationData.length}</div>
<p className="text-xs text-muted-foreground mt-1">
  {
    inseminationData.filter(i => i.status === "Confirmada").length
  } confirmadas | {
    inseminationData.filter(i => i.status === "Aguardando").length
  } aguardando
</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nascimentos (Mês)</CardTitle>
            <User className="h-4 w-4 text-cattle-primary" />
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">{birthsData.reduce((total, birth) => total + birth.offspring, 0)}</div>
<p className="text-xs text-muted-foreground mt-1">{
  birthsData.reduce((total, birth) => total + birth.offspring, 0) - 1
} saudáveis | 1 complicação</p>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Parto</CardTitle>
            <BellDot className="h-4 w-4 text-cattle-danger" />
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">
  {diasRestantes !== null ? `${diasRestantes} dias` : 'Sem previsão'}
</div>
<p className="text-xs text-muted-foreground mt-1">
  {partoMaisProximo ? `${partoMaisProximo.name} (${partoMaisProximo.animal})` : 'Nenhum parto previsto'}
</p>

          </CardContent>
        </Card>
      </div>
      <Card>
  <CardHeader>
    <CardTitle>Próximos Partos</CardTitle>
    <CardDescription>Monitoramento das gestações e datas previstas</CardDescription>
  </CardHeader>
  <CardContent>
    {upcomingBirths.length > 0 ? (
      <div className="space-y-4">
        {upcomingBirths.map((birth) => (
          <div key={birth.id} className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {birth.name} ({birth.animal})
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                  {format(birth.expectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                  <Clock className="ml-2 mr-1 h-3.5 w-3.5" />
                  {birth.daysLeft} dias restantes
                </div>
              </div>
              <Badge variant={
                birth.daysLeft < 60 ? 'destructive' :
                birth.daysLeft < 120 ? 'default' : 'outline'
              }>
                {birth.daysLeft < 60 ? 'Iminente' :
                 birth.daysLeft < 120 ? 'Em breve' : 'Programado'}
              </Badge>
            </div>
            <Progress value={birth.progress} className="h-2" />
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Nenhum parto previsto</p>
    )}
  </CardContent>
</Card>


      <Tabs defaultValue="inseminacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inseminacoes">Inseminações</TabsTrigger>
          <TabsTrigger value="nascimentos">Nascimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="inseminacoes">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Inseminações</CardTitle>
              <CardDescription>Histórico de inseminações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Animal</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Touro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nascimento Previsto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inseminationData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.animal}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{format(item.date, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell>{item.bull}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Confirmada' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(item.expectedBirth, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">Ver Tudo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="nascimentos">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Nascimentos</CardTitle>
              <CardDescription>Histórico de partos e bezerros nascidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mãe</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Pai</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Crias</TableHead>
                    <TableHead>IDs dos Bezerros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {birthsData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.mother}</TableCell>
                      <TableCell>{item.motherName}</TableCell>
                      <TableCell>{item.father}</TableCell>
                      <TableCell>{format(item.date, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                      <TableCell>{item.offspring}</TableCell>
                      <TableCell>{item.calves.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">Ver Tudo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reproduction;
