import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório' }),
});

type FazendaForm = z.infer<typeof schema>;

interface FazendaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { id: number; nome: string };
}

export const FazendaModal: React.FC<FazendaModalProps> = ({ open, onClose, onSuccess, initialData }) => {
  const { toast } = useToast();
  const isEdit = Boolean(initialData?.id);
  const form = useForm<FazendaForm>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '' },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ nome: initialData.nome });
    }
  }, [initialData]);

  const handleSubmit = async (data: FazendaForm) => {
    const token = localStorage.getItem('access_token');
    const url = isEdit
      ? `http://localhost:8000/api/usuarios/fazendas/${initialData!.id}/`
      : 'http://localhost:8000/api/api/usuarios/fazendas/';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Erro ao salvar fazenda' });
      return;
    }

    toast({ title: isEdit ? 'Fazenda atualizada' : 'Fazenda criada com sucesso' });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Fazenda' : 'Nova Fazenda'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input placeholder="Nome da Fazenda" {...form.register('nome')} />
          <Button type="submit" className="w-full">
            {isEdit ? 'Salvar Alterações' : 'Criar Fazenda'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
