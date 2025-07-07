import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileDown, Filter, Trash, Pencil, Ban } from 'lucide-react';
import { AnimalDetalhesModal } from '@/components/animais/AnimalDetalhesModal'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const defaultAnimal = {
  id: null,
  name: '',
  tag: '',
  breed: '',
  category: '',
  gender: '',
  birth_date: '',
  weight: 0,
};

const Animals = () => {
  const [animals, setAnimals] = useState<any[]>([]);
  const [editingAnimal, setEditingAnimal] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [gender, setGender] = useState('all');
  const [pasture, setPasture] = useState('all');

  const [breedFilter, setBreedFilter] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [tempBreedFilter, setTempBreedFilter] = useState('');
  const [tempMinWeight, setTempMinWeight] = useState('');
  const [tempMaxWeight, setTempMaxWeight] = useState('');
  const [tempStatusFilter, setTempStatusFilter] = useState('all');

  const [pastagens, setPastagens] = useState<any[]>([]);


  const [encerrarAnimalId, setEncerrarAnimalId] = useState<number | null>(null);
  const [encerrarModalOpen, setEncerrarModalOpen] = useState(false);

  const [visualizandoAnimal, setVisualizandoAnimal] = useState<any | null>(null)
  const [visualizandoModalAberto, setVisualizandoModalAberto] = useState(false)

  const token = localStorage.getItem('access_token');

  const fetchAnimals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/animais/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAnimals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPastagens = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/pastagens/da_fazenda/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPastagens(data);
    } catch (err) {
      console.error('Erro ao carregar pastagens:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/animais/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimals((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Erro ao excluir animal:', err);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingAnimal?.id ? 'PATCH' : 'POST';
      const url = editingAnimal?.id
        ? `http://localhost:8000/api/animais/${editingAnimal.id}/`
        : 'http://localhost:8000/api/animais/';
  
      const token = localStorage.getItem('access_token');
      const fazendaId = localStorage.getItem('fazenda_id');
  
      const payload = {
        ...editingAnimal,
        ...(editingAnimal.pastagem && { pastagem_id: editingAnimal.pastagem }),
        ...(method === 'POST' && {
          status: 'Ativo',
          fazenda: parseInt(fazendaId || '0'),
        }),
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Erro ao salvar animal');
  
      await fetchAnimals();
      setModalOpen(false);
      setEditingAnimal(null);
    } catch (err) {
      console.error(err);
    }
  };


  const handleEncerrar = async (status: 'Vendido' | 'Morto') => {
    if (!encerrarAnimalId) return;

    try {
      const response = await fetch(`http://localhost:8000/api/animais/${encerrarAnimalId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Falha ao encerrar animal');

      await fetchAnimals();
      setEncerrarModalOpen(false);
      setEncerrarAnimalId(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao encerrar animal.');
    }
  };

  const handleVisualizarAnimal = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/animais/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVisualizandoAnimal(data);
      setVisualizandoModalAberto(true);
    } catch (err) {
      console.error('Erro ao buscar animal:', err);
    }
  }

  useEffect(() => {
    fetchAnimals();
    fetchPastagens();
  }, []);

  const filteredAnimals = animals.filter((animal) => {
    const isBezerro = animal.category === 'Bezerro';
    const birthDate = new Date(animal.birth_date);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const mostrarNaTabela =true

    const matchesSearch =
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.tag?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category === 'all' || animal.category === category;
    const matchesGender = gender === 'all' || animal.gender === gender;
    const matchesBreed = !breedFilter || animal.breed?.toLowerCase().includes(breedFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
    const matchesPasture =
      pasture === 'all' ||
      (typeof animal.pastagem === 'object'
        ? animal.pastagem?.id === parseInt(pasture)
        : animal.pastagem === parseInt(pasture));

    const matchesMinWeight = !minWeight || parseFloat(animal.weight) >= parseFloat(minWeight);
    const matchesMaxWeight = !maxWeight || parseFloat(animal.weight) <= parseFloat(maxWeight);

    return (
      mostrarNaTabela &&
      matchesSearch &&
      matchesCategory &&
      matchesGender &&
      matchesBreed &&
      matchesStatus &&
      matchesPasture &&
      matchesMinWeight &&
      matchesMaxWeight
    );
  });

  const ativos = useMemo(() => filteredAnimals.filter(a => a.status === 'Ativo'), [filteredAnimals]);
  const encerrados = useMemo(() => filteredAnimals.filter(a => a.status !== 'Ativo'), [filteredAnimals]);

  const exportToExcel = () => {
    const data = filteredAnimals.map((animal) => ({
      ID: animal.id,
      Nome: animal.name,
      Tag: animal.tag,
      Raça: animal.breed,
      Categoria: animal.category,
      Sexo: animal.gender,
      'Data de Nascimento': animal.birth_date,
      'Peso (kg)': animal.weight,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Animais');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `animais_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Animais</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Rebanho Ativo</CardTitle>
              <div className="flex gap-x-2">
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <Button
                    onClick={() => {setEditingAnimal(defaultAnimal); setModalOpen(true);} }
                    className="ml-auto h-8 px-3 bg-cattle-primary hover:bg-cattle-primary/90 text-sm"
                  >
                    <Plus size={14} className="mr-1" /> Novo Animal
                  </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAnimal?.id ? 'Editar Animal' : 'Novo Animal'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label>Nome</Label>
                      <Input
                        type="text"
                        value={editingAnimal?.name || ''}
                        onChange={(e) => setEditingAnimal({ ...editingAnimal, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Identificação (Tag)</Label>
                      <Input
                        type="text"
                        value={editingAnimal?.tag || ''}
                        onChange={(e) => setEditingAnimal({ ...editingAnimal, tag: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Raça</Label>
                      <Input
                        type="text"
                        value={editingAnimal?.breed || ''}
                        onChange={(e) => setEditingAnimal({ ...editingAnimal, breed: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Categoria</Label>
                      <Select
                        value={editingAnimal?.category || ''}
                        onValueChange={(value) => setEditingAnimal({ ...editingAnimal, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matriz">Matriz</SelectItem>
                          <SelectItem value="Reprodutor">Reprodutor</SelectItem>
                          <SelectItem value="Novilha">Novilha</SelectItem>
                          <SelectItem value="Novilho">Novilho</SelectItem>
                          <SelectItem value="Bezerro">Bezerro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label>Sexo</Label>
                      <Select
                        value={editingAnimal?.gender || ''}
                        onValueChange={(value) => setEditingAnimal({ ...editingAnimal, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Macho">Macho</SelectItem>
                          <SelectItem value="Fêmea">Fêmea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label>Pastagem</Label>
                      <Select
                        value={editingAnimal?.pastagem ? String(editingAnimal.pastagem) : ''}
                        onValueChange={(value) => setEditingAnimal({ ...editingAnimal, pastagem: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a pastagem" />
                        </SelectTrigger>
                        <SelectContent>
                          {pastagens.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={editingAnimal?.birth_date || ''}
                        onChange={(e) => setEditingAnimal({ ...editingAnimal, birth_date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        value={editingAnimal?.weight || ''}
                        onChange={(e) => setEditingAnimal({ ...editingAnimal, weight: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        {editingAnimal?.id ? 'Atualizar' : 'Cadastrar'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filtros
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filtros Avançados</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">

                    <div className="grid gap-2">
                      <Label htmlFor="breed">Raça</Label>
                      <Input id="breed" placeholder="Ex: Nelore" value={tempBreedFilter} onChange={(e) => setTempBreedFilter(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="minWeight">Peso Mínimo</Label>
                        <Input id="minWeight" type="number" placeholder="0" value={tempMinWeight} onChange={(e) => setTempMinWeight(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxWeight">Peso Máximo</Label>
                        <Input id="maxWeight" type="number" placeholder="1000" value={tempMaxWeight} onChange={(e) => setTempMaxWeight(e.target.value)} />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStatusFilter('all');
                          setBreedFilter('');
                          setMinWeight('');
                          setMaxWeight('');
                          setTempStatusFilter('all');
                          setTempBreedFilter('');
                          setTempMinWeight('');
                          setTempMaxWeight('');
                          setFilterModalOpen(false);
                        }}
                      >
                        Limpar Filtros
                      </Button>
                      <Button
                        onClick={() => {
                          setStatusFilter(tempStatusFilter);
                          setBreedFilter(tempBreedFilter);
                          setMinWeight(tempMinWeight);
                          setMaxWeight(tempMaxWeight);
                          setFilterModalOpen(false);
                        }}
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>  
            <Dialog open={encerrarModalOpen} onOpenChange={setEncerrarModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Encerrar Animal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Selecione o motivo do encerramento deste animal. Essa ação removerá eventos futuros relacionados.
                  </p>
                  <div className="flex justify-end gap-4">
                    <Button variant="destructive" onClick={() => handleEncerrar('Morto')}>
                      Marcar como Morto
                    </Button>
                    <Button variant="secondary" onClick={() => handleEncerrar('Vendido')}>
                      Marcar como Vendido
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4">
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, identificação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="Matriz">Matriz</SelectItem>
                  <SelectItem value="Reprodutor">Reprodutor</SelectItem>
                  <SelectItem value="Novilha">Novilha</SelectItem>
                  <SelectItem value="Novilho">Novilho</SelectItem>
                  <SelectItem value="Bezerro">Bezerro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Ambos</SelectItem>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Fêmea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pasture} onValueChange={setPasture}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Pastagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Pastagens</SelectItem>
                  {pastagens.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" title="Exportar" onClick={exportToExcel}>
                <FileDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
        <div className="w-full overflow-x-auto rounded-md border">
          <Table className="min-w-full table-fixed">
            <colgroup><col style={{ width:'8%' }}/><col style={{ width:'22%' }}/><col style={{ width:'15%' }}/><col className="hidden sm:table-cell" style={{ width:'12%' }}/><col className="hidden md:table-cell" style={{ width:'10%' }}/><col className="hidden lg:table-cell" style={{ width:'13%' }}/><col className="hidden lg:table-cell" style={{ width:'13%' }}/><col style={{ width:'7%' }}/><col style={{ width:'10%' }}/></colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>TAG</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="hidden md:table-cell">Sexo</TableHead>
                <TableHead className="hidden lg:table-cell">Data Nasc.</TableHead>
                <TableHead className="hidden lg:table-cell">Pastagem</TableHead>
                <TableHead className="text-right">Peso (kg)</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ativos.map(animal => {
                const nomePastagem = animal.pastagem?.name
                  ?? pastagens.find(p => p.id === animal.pastagem)?.name
                  ?? '—';
                return (
                  <TableRow key={animal.id}>
                    <TableCell
                      className="font-medium truncate cursor-pointer"
                      onClick={() => handleVisualizarAnimal(animal.id)}
                    >
                      {animal.tag}
                    </TableCell>
                    <TableCell
                      className="truncate cursor-pointer"
                      onClick={() => handleVisualizarAnimal(animal.id)}
                    >
                      {animal.name}
                    </TableCell>
                    <TableCell className="truncate">{animal.breed}</TableCell>
                    <TableCell className="hidden sm:table-cell truncate">
                      <Badge variant="outline">{animal.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell truncate">{animal.gender}</TableCell>
                    <TableCell className="hidden lg:table-cell truncate">{animal.birth_date}</TableCell>
                    <TableCell className="hidden lg:table-cell truncate">{nomePastagem}</TableCell>
                    <TableCell className="text-right">{animal.weight}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => { setEditingAnimal(animal); setModalOpen(true); }}>
                          <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Encerrar"
                        onClick={() => {
                          setEncerrarAnimalId(animal.id);
                          setEncerrarModalOpen(true);
                        }}
                      >
                        <Ban className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Excluir" onClick={() => handleDelete(animal.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

        <Card className="mt-8 border-muted">
          <CardHeader><CardTitle>Animais Encerrados</CardTitle></CardHeader>
          <CardContent>
            {/* tabela “Animais Encerrados” */}
            <div className="w-full overflow-x-auto rounded-md border">
              <Table className="min-w-full table-fixed">
                <colgroup><col style={{ width:'8%' }}/><col style={{ width:'22%' }}/><col style={{ width:'15%' }}/><col className="hidden sm:table-cell" style={{ width:'12%' }}/><col className="hidden md:table-cell" style={{ width:'10%' }}/><col className="hidden lg:table-cell" style={{ width:'13%' }}/><col className="hidden lg:table-cell" style={{ width:'13%' }}/><col style={{ width:'7%' }}/><col style={{ width:'10%' }}/></colgroup>
                <TableHeader>
                  <TableRow>
                    <TableHead>TAG</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Raça</TableHead>
                    <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                    <TableHead className="hidden md:table-cell">Sexo</TableHead>
                    <TableHead className="hidden lg:table-cell">Data Nasc.</TableHead>
                    <TableHead className="hidden lg:table-cell">Pastagem</TableHead>
                    <TableHead className="text-right">Peso (kg)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {encerrados.map(animal => {
                    const nomePastagem = animal.pastagem?.name
                      ?? pastagens.find(p => p.id === animal.pastagem)?.name
                      ?? '—';
                    return (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium truncate">{animal.tag}</TableCell>
                        <TableCell className="truncate">{animal.name}</TableCell>
                        <TableCell className="truncate">{animal.breed}</TableCell>
                        <TableCell className="hidden sm:table-cell truncate">
                          <Badge variant="outline">{animal.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell truncate">{animal.gender}</TableCell>
                        <TableCell className="hidden lg:table-cell truncate">{animal.birth_date}</TableCell>
                        <TableCell className="hidden lg:table-cell truncate">{nomePastagem}</TableCell>
                        <TableCell className="text-right">{animal.weight}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">{animal.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Card>
      <AnimalDetalhesModal
        open={visualizandoModalAberto}
        onClose={() => setVisualizandoModalAberto(false)}
        animal={visualizandoAnimal}
      />
    </div>
    
  );
};

export default Animals;
