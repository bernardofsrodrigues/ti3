// src/pages/Vaccination.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Filter, Download as DownloadIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// -------------------------------------------------------------
// Tipagens
// -------------------------------------------------------------
type StatusVacina = 'Aplicada' | 'Pendente' | 'Atrasada';

interface VacinaDTO {
  id: number;
  animal: number; // id do animal
  name: string;
  date: string;     // string ISO YYYY-MM-DD
  next_date: string;// string ISO YYYY-MM-DD
  status: StatusVacina;
  animal_nome?: string; // vinda do serializer
}

interface VacinaFront {
  id: number;
  animal: string;  // ex: "Mimosa (ID:12)"
  name: string;    // “nome da vacina”
  vaccine: string; // repetido de name, mantido para compatibilidade
  date: Date;
  nextDate: Date;
  status: StatusVacina;
}

interface AnimalDTO {
  id: number;
  name: string;
  tag: string;
}

// -------------------------------------------------------------
// Funções internas que substituem o antigo vacinaService.ts
// -------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function getVacinas(): Promise<VacinaDTO[]> {
  const token = localStorage.getItem('access_token');
  // ** Atenção: a URL real (registrada no router) é /api/vacinas/vacinas/ **
  const res = await fetch(`${API_BASE}/api/vacinas/vacinas/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar vacinações (${res.status})`);
  }
  return await res.json();
}

async function createVacina(data: {
  animal: number;
  name: string;
  date: Date;
  next_date: Date;
  status: StatusVacina;
}): Promise<VacinaDTO> {
  const token = localStorage.getItem('access_token');
  const payload = {
    animal: data.animal,
    name: data.name,
    date: data.date.toISOString().slice(0, 10),
    next_date: data.next_date.toISOString().slice(0, 10),
    status: data.status,
  };
  const res = await fetch(`${API_BASE}/api/vacinas/vacinas/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Falha ao criar vacinação (${res.status})`);
  }
  return await res.json();
}

async function getAnimals(): Promise<AnimalDTO[]> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/api/animais/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Falha ao buscar animais (${res.status})`);
  }
  return await res.json();
}

// -------------------------------------------------------------
// Componente Vaccination
// -------------------------------------------------------------
const Vaccination: React.FC = () => {
  // -----------------------------------------------------------
  // 1) Estados de controle geral
  // -----------------------------------------------------------
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<StatusVacina | 'todos'>(
    'todos'
  );
  const [vaccinations, setVaccinations] = useState<VacinaDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------
  // 2) Estados para o dropdown de animais
  // -----------------------------------------------------------
  const [animals, setAnimals] = useState<AnimalDTO[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState<boolean>(false);
  const [animalsError, setAnimalsError] = useState<string | null>(null);

  // -----------------------------------------------------------
  // 3) Estados para modal de “Nova Vacina”
  // -----------------------------------------------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    animal: string;   // guardamos o ID em formato de string
    name: string;
    date: string;      // "YYYY-MM-DD"
    next_date: string; // "YYYY-MM-DD"
    status: StatusVacina;
  }>({
    animal: '',
    name: '',
    date: '',
    next_date: '',
    status: 'Aplicada',
  });

  // -----------------------------------------------------------
  // 4) Ao montar, carrega animais e vacinações
  // -----------------------------------------------------------
  useEffect(() => {
    (async () => {
      // 4.1) Carregar animais
      setAnimalsLoading(true);
      try {
        const dadosAnimais = await getAnimals();
        setAnimals(dadosAnimais);
      } catch (err) {
        console.error(err);
        setAnimalsError('Não foi possível carregar a lista de animais');
      } finally {
        setAnimalsLoading(false);
      }

      // 4.2) Carregar vacinações
      setIsLoading(true);
      try {
        const data = await getVacinas();
        setVaccinations(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar vacinações');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // -----------------------------------------------------------
  // 5) Converter VacinaDTO → VacinaFront
  // -----------------------------------------------------------
  const todasVacinas: VacinaFront[] = useMemo(() => {
    return vaccinations.map((v) => ({
      id: v.id,
      animal: v.animal_nome
        ? `${v.animal_nome} (ID:${v.animal})`
        : `Animal ${v.animal}`,
      name: v.name,
      vaccine: v.name,
      date: new Date(v.date),
      nextDate: new Date(v.next_date),
      status: v.status as StatusVacina,
    }));
  }, [vaccinations]);

  // -----------------------------------------------------------
  // 6) Filtrar vacinações para tabela de histórico
  // -----------------------------------------------------------
  const filteredVaccinations: VacinaFront[] = useMemo(() => {
    return todasVacinas.filter((vacc) => {
      const matchesSearch =
        vacc.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacc.vaccine.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'todos' || vacc.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [todasVacinas, searchTerm, filterStatus]);

  // -----------------------------------------------------------
  // 7) Validação de formulário “Nova Vacina”
  // -----------------------------------------------------------
  const isFormValid = (): boolean => {
    return (
      form.animal.trim() !== '' &&
      form.name.trim() !== '' &&
      form.date.trim() !== '' &&
      form.next_date.trim() !== '' &&
      ['Aplicada', 'Pendente', 'Atrasada'].includes(form.status)
    );
  };

  // -----------------------------------------------------------
  // 8) Cria nova vacinação
  // -----------------------------------------------------------
  const handleSave = async () => {
    if (!isFormValid()) return;
    try {
      await createVacina({
        animal: Number(form.animal),
        name: form.name.trim(),
        date: new Date(form.date),
        next_date: new Date(form.next_date),
        status: form.status,
      });

      // 8.1) Fechar modal e resetar formulário
      setModalOpen(false);
      setForm({
        animal: '',
        name: '',
        date: '',
        next_date: '',
        status: 'Aplicada',
      });

      // 8.2) Recarregar lista de vacinações
      setIsLoading(true);
      try {
        const data = await getVacinas();
        setVaccinations(data);
      } catch {
        // Já reportamos erro acima
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erro ao criar vacinação', err);
      alert('Erro ao criar vacinação. Confira os campos e tente novamente.');
    }
  };

  // -----------------------------------------------------------
  // 9) Render
  // -----------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in mt-16 px-4 lg:px-8">
      {/* ------------------------------------------------------------ */}
      {/* Cabeçalho: Título + Botão “Nova Vacina” + Botão “Exportar”     */}
      {/* ------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vacinação</h1>
          <p className="text-muted-foreground">
            Gerencie as vacinações do seu rebanho
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Botão que abre o modal de Nova Vacina */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Nova Vacina
              </Button>
            </DialogTrigger>
            {/* Modal de criação */}
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Vacinação</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* Seleção do animal */}
                <div className="grid gap-1">
                  <Label>Animal *</Label>
                  {animalsLoading ? (
                    <p className="text-sm text-muted-foreground">
                      Carregando animais…
                    </p>
                  ) : animalsError ? (
                    <p className="text-sm text-red-500">{animalsError}</p>
                  ) : animals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum animal cadastrado.
                    </p>
                  ) : (
                    <Select
                      value={form.animal}
                      onValueChange={(value) =>
                        setForm((f) => ({ ...f, animal: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o animal" />
                      </SelectTrigger>
                      <SelectContent>
                        {animals.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.tag} – {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Nome da vacina */}
                <div className="grid gap-1">
                  <Label>Nome da Vacina *</Label>
                  <Input
                    placeholder="Ex: Febre Aftosa"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>

                {/* Data da aplicação */}
                <div className="grid gap-1">
                  <Label>Data da Aplicação *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>

                {/* Próxima dose */}
                <div className="grid gap-1">
                  <Label>Próxima Dose *</Label>
                  <Input
                    type="date"
                    value={form.next_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, next_date: e.target.value }))
                    }
                  />
                </div>

                {/* Status da vacinação */}
                <div className="grid gap-1">
                  <Label>Status *</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, status: value as StatusVacina }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aplicada">Aplicada</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Atrasada">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão “Salvar” */}
                <div className="flex justify-end">
                  <Button
                    disabled={!isFormValid() || animals.length === 0}
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Botão Exportar */}
          <Button
            variant="outline"
            onClick={() => {
              // Você pode gerar CSV/Excel usando "todasVacinas" aqui, se quiser.
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Card: Calendário de Vacinação + Próximas Vacinações         */}
      {/* ------------------------------------------------------------ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Calendário de Vacinação</CardTitle>
          <CardDescription>
            Visualize e planeje as próximas vacinações do seu rebanho
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow p-3 w-full"
              locale={ptBR}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Próximas Vacinações</h3>
            <div className="space-y-2">
              {date &&
                todasVacinas
                  .filter(
                    (v) => v.nextDate.toDateString() === date.toDateString()
                  )
                  .map((vacc) => (
                    <div
                      key={vacc.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{vacc.animal}</p>
                        <p className="text-sm text-muted-foreground">
                          {vacc.vaccine}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Aqui poderia abrir modal de edição, se desejado
                        }}
                      >
                        Registrar
                      </Button>
                    </div>
                  ))}
              {date &&
                !todasVacinas.some(
                  (v) => v.nextDate.toDateString() === date.toDateString()
                ) && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma vacinação programada para esta data
                  </p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------ */}
      {/* Card: Histórico de Vacinações                              */}
      {/* ------------------------------------------------------------ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Vacinações</CardTitle>
          <CardDescription>
            Consulte o registro completo de vacinações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros de busca e status */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por animal, vacina..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterStatus}
                onValueChange={(val) =>
                  setFilterStatus(val as StatusVacina | 'todos')
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Aplicada">Aplicada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Exibe loading, erro ou tabela */}
          {isLoading && <p>Carregando vacinações…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Animal</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Vacina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Próxima Dose</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccinations.map((vacc) => (
                    <TableRow key={vacc.id}>
                      <TableCell className="font-medium">
                        {vacc.animal}
                      </TableCell>
                      <TableCell>{vacc.name}</TableCell>
                      <TableCell>{vacc.vaccine}</TableCell>
                      <TableCell>
                        {format(vacc.date, 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        {format(vacc.nextDate, 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vacc.status === 'Aplicada'
                              ? 'outline'
                              : vacc.status === 'Pendente'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {vacc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Vaccination;