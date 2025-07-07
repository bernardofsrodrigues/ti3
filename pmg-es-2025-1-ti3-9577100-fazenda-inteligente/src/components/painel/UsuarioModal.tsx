import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha obrigatória' }).optional(),
  tipo: z.enum(['admin_fazenda', 'funcionario', 'veterinario']),
  fazenda: z.string().nullable(),
});

type UsuarioForm = z.infer<typeof schema>;

interface UsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: number;
    email: string;
    tipo: string;
    fazenda: string | null;
  };
}

export const UsuarioModal: React.FC<UsuarioModalProps> = ({ open, onClose, onSuccess, initialData }) => {
  const { toast } = useToast();
  const isEdit = Boolean(initialData?.id);
  const [fazendas, setFazendas] = useState<{ id: number; nome: string }[]>([]);

  const form = useForm<UsuarioForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      tipo: 'funcionario',
      fazenda: null,
    },
  });

  useEffect(() => {
    const fetchFazendas = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/api/usuarios/fazendas/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFazendas(data);
      } catch {
        toast({ variant: 'destructive', title: 'Erro ao carregar fazendas' });
      }
    };
    fetchFazendas();
  }, []);

  useEffect(() => {
    if (initialData) {
      form.reset({
        email: initialData.email,
        tipo: initialData.tipo as UsuarioForm['tipo'],
        fazenda: initialData.fazenda ? String(initialData.fazenda) : null,
      });
    }
  }, [initialData]);

  const handleSubmit = async (data: UsuarioForm) => {
    const token = localStorage.getItem('access_token');
    const url = isEdit
      ? `http://localhost:8000/api/usuarios/usuarios/${initialData!.id}/`
      : 'http://localhost:8000/api/usuarios/usuarios/';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = isEdit ? { ...data } : { ...data, password: data.password || '12345678' };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Erro ao salvar usuário' });
      return;
    }

    toast({ title: isEdit ? 'Usuário atualizado' : 'Usuário criado com sucesso' });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input placeholder="Email" {...form.register('email')} />
          {!isEdit && (
            <Input placeholder="Senha" type="password" {...form.register('password')} />
          )}

          {/* TIPO */}
          <Select
            value={form.watch('tipo')}
            onValueChange={(val) => form.setValue('tipo', val as UsuarioForm['tipo'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo do Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin_fazenda">Administrador da Fazenda</SelectItem>
              <SelectItem value="funcionario">Funcionário</SelectItem>
              <SelectItem value="veterinario">Veterinário</SelectItem>
            </SelectContent>
          </Select>

          {/* FAZENDA */}
          <Select
            value={form.watch('fazenda') ?? ''}
            onValueChange={(val) => form.setValue('fazenda', val || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Fazenda (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {fazendas.length === 0 ? (
                <SelectItem disabled value="null">Nenhuma fazenda disponível</SelectItem>
              ) : (
                <>
                  <SelectItem value="null">Sem fazenda</SelectItem>
                  {fazendas.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full">
            {isEdit ? 'Salvar Alterações' : 'Criar Usuário'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};