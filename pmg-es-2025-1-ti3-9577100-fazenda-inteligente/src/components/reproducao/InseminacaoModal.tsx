'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addMonths, parseISO, format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  animal: z.string().min(1, 'Selecione o animal'),
  bull: z.string().min(1, 'Informe o touro'),
  date: z.string().min(1, 'Informe a data da inseminação'),
  status: z.enum(['Confirmada', 'Aguardando']),
  expected_birth: z.string().optional(),  // Novo campo
});

type InseminacaoFormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InseminacaoModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [animais, setAnimais] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InseminacaoFormData>({ resolver: zodResolver(schema) });

  const [matrizes, setMatrizes] = useState<any[]>([]);
  const [reprodutores, setReprodutores] = useState<any[]>([]);
  
  useEffect(() => {
      if (open) {
      const token = localStorage.getItem('access_token');
      fetch('http://localhost:8000/api/animais/', {
          headers: { Authorization: `Bearer ${token}` },
      })
          .then(res => res.json())
          .then(data => {
          if (Array.isArray(data)) {
              setMatrizes(data.filter(a => a.gender === 'Fêmea' && a.category === 'Matriz'));
              setReprodutores(data.filter(a => a.gender === 'Macho' && a.category === 'Reprodutor'));
          }
          })
          .catch(console.error);
      }
  }, [open]);

  const onSubmit = async (data: InseminacaoFormData) => {
    const token = localStorage.getItem('access_token');

    const dataInseminacao = parseISO(data.date);
    const nascimentoEstimado = addMonths(dataInseminacao, 9);
    const expected_birth = format(nascimentoEstimado, 'yyyy-MM-dd');

    const payload = {
      ...data,
      expected_birth,
    };

    try {
      const res = await fetch('http://localhost:8000/api/reproducao/inseminacoes/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao cadastrar inseminação');

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Inseminação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="animal">Matriz</Label>
            <Select onValueChange={value => setValue('animal', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a matriz" />
              </SelectTrigger>
              <SelectContent>
                {matrizes.map(a => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name || 'Sem nome'} ({a.tag || 'sem TAG'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('animal')} />
            {errors.animal && <p className="text-sm text-red-500">{errors.animal.message}</p>}
          </div>

          <div>
              <Label htmlFor="bull">Touro (Reprodutor)</Label>
              <Select onValueChange={value => setValue('bull', value)}>
              <SelectTrigger>
                  <SelectValue placeholder="Selecione o reprodutor" />
              </SelectTrigger>
              <SelectContent>
                  {reprodutores.map(a => (
                  <SelectItem key={a.id} value={String(a.id)}>
                      {a.name || 'Sem nome'} ({a.tag || 'sem TAG'})
                  </SelectItem>
                  ))}
              </SelectContent>
              </Select>
              <input type="hidden" {...register('bull')} />
              {errors.bull && <p className="text-sm text-red-500">{errors.bull.message}</p>}
          </div>

          {/* Data */}
          <div>
            <Label htmlFor="date">Data da Inseminação</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select onValueChange={value => setValue('status', value as 'Confirmada' | 'Aguardando')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register('status')} />
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InseminacaoModal;
