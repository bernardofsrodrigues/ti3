import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FazendaModal, UsuarioModal } from '@/components/painel';

const PainelControle = () => {
  const [fazendas, setFazendas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedFazenda, setSelectedFazenda] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showFazendaModal, setShowFazendaModal] = useState(false);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const fetchData = () => {
    fetch('http://localhost:8000/api/usuarios/fazendas/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setFazendas)
      .catch(() => toast({ variant: 'destructive', title: 'Erro ao carregar fazendas' }));

    fetch('http://localhost:8000/api/usuarios/usuarios/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUsuarios)
      .catch(() => toast({ variant: 'destructive', title: 'Erro ao carregar usuários' }));
  };

  useEffect(fetchData, []);

  const handleDelete = (id: number, type: 'usuario' | 'fazenda') => {
    const endpoint = type === 'usuario' ? 'usuarios' : 'fazendas';
    fetch(`http://localhost:8000/api/${endpoint}/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchData();
        toast({ title: `${type === 'usuario' ? 'Usuário' : 'Fazenda'} deletado com sucesso` });
      })
      .catch(() => toast({ variant: 'destructive', title: 'Erro ao deletar' }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel de Controle</h1>
        <Button onClick={() => navigate('/')} variant="outline">Voltar</Button>
      </div>

      {/* FAZENDAS */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Fazendas</CardTitle>
          <Button size="sm" onClick={() => { setSelectedFazenda(null); setShowFazendaModal(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Nova Fazenda
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fazendas.map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell>{f.id}</TableCell>
                  <TableCell>{f.nome}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedFazenda(f); setShowFazendaModal(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(f.id, 'fazenda')}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* USUÁRIOS */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Usuários</CardTitle>
          <Button size="sm" onClick={() => { setSelectedUsuario(null); setShowUsuarioModal(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Novo Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fazenda</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.tipo}</TableCell>
                  <TableCell>{u.fazenda || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => { setSelectedUsuario(u); setShowUsuarioModal(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(u.id, 'usuario')}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modais */}
      {showFazendaModal && (
        <FazendaModal
          open={showFazendaModal}
          initialData={selectedFazenda}
          onClose={() => setShowFazendaModal(false)}
          onSuccess={fetchData}
        />
      )}
      {showUsuarioModal && (
        <UsuarioModal
        open={showUsuarioModal}
        initialData={selectedUsuario}
        onClose={() => setShowUsuarioModal(false)}
        onSuccess={fetchData}
      />
      )}
    </div>
  );
};

export default PainelControle;