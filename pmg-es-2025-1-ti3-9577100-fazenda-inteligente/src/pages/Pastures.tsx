
import React from 'react';
import { Plus, Download, Leaf, Droplets, Timer, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PieChart from '@/components/dashboard/PieChart';
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


// Dados para distribuição de pastagens
const pastureDistribution = [
  { name: 'Bom', value: 8.2 }
];

const waterSources = [
  { id: 1, name: 'Açude Principal', type: 'Açude', capacity: 15000, current: 12000, status: 'Adequado' },
  { id: 2, name: 'Rio Norte', type: 'Rio', capacity: null, current: null, status: 'Adequado' },
  { id: 3, name: 'Poço Central', type: 'Poço', capacity: 5000, current: 2000, status: 'Baixo' },
];


const Pastures = () => {
  const [pastureData, setPastureData] = React.useState([
    {
      id: 1,
      name: 'Pastagem Teste',
      area: 10.5, // em hectares
      capacity: 30, // capacidade máxima de animais
      current: 20, // quantidade atual de animais
      status: 'Bom',
      lastRotation: '2025-06-01', // formato YYYY-MM-DD (string ou Date)
    },
  ]);
  
  
  const [pastureModalOpen, setPastureModalOpen] = React.useState(false);
  
  const [pastureForm, setPastureForm] = React.useState({
    name: '',
    area: '',
    capacity: '',
    current: '',
    status: 'Bom',
    lastRotation: '',
  });

  const token = localStorage.getItem('access_token'); // se usa autenticação

  const handleSavePasture = () => {
    const isValid = Object.values(pastureForm).every(v => v.toString().trim() !== '');
    if (!isValid) return alert('Preencha todos os campos corretamente.');
  
    const newPasture = {
      id: Date.now(), // Gera ID temporário
      name: pastureForm.name,
      area: parseFloat(pastureForm.area),
      capacity: parseInt(pastureForm.capacity),
      current: parseInt(pastureForm.current),
      status: pastureForm.status,
      lastRotation: pastureForm.lastRotation,
    };
  
    setPastureData(prev => [...prev, newPasture]);
  
    setPastureModalOpen(false);
    setPastureForm({
      name: '',
      area: '',
      capacity: '',
      current: '',
      status: 'Bom',
      lastRotation: '',
    });
  };
  

const pastureAlerts = pastureData
  .filter(p => p.status === 'Crítico')
  .map(p => ({
    id: p.id,
    pasture: p.name,
    message: 'Atenção: esta pastagem está em estado crítico.',
    severity: 'alert',
    date: new Date(p.lastRotation),
  }));

  const pastureDistribution = pastureData.map(p => ({
    name: p.status,
    value: Number(p.area.toFixed(2))
  }));
  
  
  return (
    <div className="mt-16 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pastagens</h1>
          <p className="text-muted-foreground">Gestão de pastagens e recursos hídricos</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
        <Dialog open={pastureModalOpen} onOpenChange={setPastureModalOpen}>
  <DialogTrigger asChild>
    <Button className="whitespace-nowrap">
      <Plus className="mr-2 h-4 w-4" />
      Nova Pastagem
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Registrar Nova Pastagem</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4">
      {/* Campos do formulário */}
      <div className="grid gap-1">
        <Label>Nome *</Label>
        <Input value={pastureForm.name} onChange={(e) => setPastureForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="grid gap-1">
        <Label>Área (ha) *</Label>
        <Input type="number" value={pastureForm.area} onChange={(e) => setPastureForm(f => ({ ...f, area: e.target.value }))} />
      </div>
      <div className="grid gap-1">
        <Label>Capacidade *</Label>
        <Input type="number" value={pastureForm.capacity} onChange={(e) => setPastureForm(f => ({ ...f, capacity: e.target.value }))} />
      </div>
      <div className="grid gap-1">
        <Label>Ocupação Atual *</Label>
        <Input type="number" value={pastureForm.current} onChange={(e) => setPastureForm(f => ({ ...f, current: e.target.value }))} />
      </div>
      <div className="grid gap-1">
        <Label>Status *</Label>
        <Select value={pastureForm.status} onValueChange={(val) => setPastureForm(f => ({ ...f, status: val }))}>
          <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Ótimo">Ótimo</SelectItem>
            <SelectItem value="Bom">Bom</SelectItem>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label>Última Rotação *</Label>
        <Input type="date" value={pastureForm.lastRotation} onChange={(e) => setPastureForm(f => ({ ...f, lastRotation: e.target.value }))} />
      </div>
      <div className="flex justify-end">
      <Button onClick={handleSavePasture}>
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
        <Card className="md:col-span-2 h-100">
          <CardHeader>
            <CardTitle>Distribuição de Pastagens</CardTitle>
            <CardDescription>Área total: 46.5 hectares</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
            <PieChart 
  title="Distribuição do Rebanho"
  data={pastureDistribution} 
/>

            </div>
          </CardContent>
        </Card>
        
        <Card>
  <CardHeader>
    <CardTitle>Alertas</CardTitle>
    <CardDescription>Notificações importantes sobre áreas</CardDescription>
  </CardHeader>
  <CardContent>
    {pastureAlerts.length > 0 ? (
      <div className="space-y-4">
        {pastureAlerts.map(alert => (
          <div key={alert.id} className="flex items-start gap-2 p-3 border rounded-md">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium">{alert.pasture}</p>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">Nenhuma pastagem crítica no momento.</p>
    )}
  </CardContent>
</Card>

      </div>

      <Tabs defaultValue="pastagens" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pastagens">Pastagens</TabsTrigger>
          <TabsTrigger value="agua">Fontes de Água</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pastagens">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Pastagens</CardTitle>
              <CardDescription>Informações sobre áreas de pastagem e lotação</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Área (ha)</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Ocupação Atual</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Rotação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastureData.map((item) => {
                    const occupationPercentage = (item.current / item.capacity) * 100;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.area}</TableCell>
                        <TableCell>{item.capacity} animais</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{item.current} animais</span>
                              <span>{Math.round(occupationPercentage)}%</span>
                            </div>
                            <Progress 
                              value={occupationPercentage} 
                              className={`h-2 ${
                                occupationPercentage > 90 ? 'bg-red-200' : 
                                occupationPercentage > 75 ? 'bg-yellow-200' : 
                                'bg-emerald-200'
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            item.status === 'Ótimo' ? 'outline' : 
                            item.status === 'Bom' ? 'default' : 
                            item.status === 'Regular' ? 'secondary' : 
                            'destructive'
                          }>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Intl.DateTimeFormat('pt-BR').format(new Date(item.lastRotation))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">Gerenciar Rotação</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="agua">
          <Card>
            <CardHeader>
              <CardTitle>Fontes de Água</CardTitle>
              <CardDescription>Recursos hídricos disponíveis para o rebanho</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Volume Atual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waterSources.map((source) => {
                    const capacityPercentage = source.capacity ? (source.current! / source.capacity) * 100 : null;
                    
                    return (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {source.type === 'Açude' ? (
                              <Droplets className="h-4 w-4 text-blue-500" />
                            ) : source.type === 'Rio' ? (
                              <Zap className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Droplets className="h-4 w-4 text-blue-500" />
                            )}
                            {source.type}
                          </div>
                        </TableCell>
                        <TableCell>{source.capacity ? `${source.capacity} m³` : 'Natural'}</TableCell>
                        <TableCell>
                          {capacityPercentage !== null ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{source.current} m³</span>
                                <span>{Math.round(capacityPercentage!)}%</span>
                              </div>
                              <Progress 
                                value={capacityPercentage} 
                                className={`h-2 ${
                                  capacityPercentage < 30 ? 'bg-red-200' : 
                                  capacityPercentage < 50 ? 'bg-yellow-200' : 
                                  'bg-blue-200'
                                }`}
                              />
                            </div>
                          ) : (
                            'Fluxo Contínuo'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            source.status === 'Adequado' ? 'default' : 
                            source.status === 'Baixo' ? 'destructive' : 'outline'
                          }>
                            {source.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">Adicionar Fonte</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pastures;
