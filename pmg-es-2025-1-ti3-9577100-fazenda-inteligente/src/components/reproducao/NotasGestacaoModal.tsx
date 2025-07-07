'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Nota {
  id: number;
  data: string;
  observacao: string;
  autor_nome: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  inseminacaoId: number | null;
  status: string;
}

const NotasGestacaoModal: React.FC<Props> = ({
  open,
  onClose,
  inseminacaoId,
  status,
}) => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [novaNota, setNovaNota] = useState('');
  const [loading, setLoading] = useState(false);

    const fetchNotas = async () => {
      if (!inseminacaoId) return;
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch(`http://localhost:8000/api/reproducao/notas-gestacao/?inseminacao=${inseminacaoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotas(data);
      } catch (err) {
        console.error(err);
      }
    };

  const enviarNota = async () => {
    if (!inseminacaoId || novaNota.length < 5) return;
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`http://localhost:8000/api/reproducao/notas-gestacao/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inseminacao: inseminacaoId,
          observacao: novaNota,
        }),
      });
      setNovaNota('');
      await fetchNotas();
    } catch (err) {
      console.error('Erro ao salvar nota:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotas();
    }
  }, [open, inseminacaoId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Notas da Gestação</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-48 border rounded-md p-2 space-y-2">
          {notas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma nota registrada.</p>
          ) : (
            notas.map((nota) => (
              <div key={nota.id} className="text-sm border-b pb-2">
                <p className="font-medium">{nota.autor_nome}</p>
                <p className="text-xs text-muted-foreground">{new Date(nota.data).toLocaleString()}</p>
                <p>{nota.observacao}</p>
              </div>
            ))
          )}
        </ScrollArea>

        {status !== 'Cancelada' && (
          <div className="space-y-2 pt-4">
            <Label htmlFor="novaNota">Nova Nota</Label>
            <Textarea
              id="novaNota"
              rows={3}
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
            />
            <Button
              disabled={novaNota.length < 5 || loading}
              onClick={enviarNota}
              className="w-full"
            >
              Salvar Nota
            </Button>
          </div>
        )}

        {status === 'Cancelada' && (
          <p className="text-sm text-destructive mt-4">
            Esta inseminação foi cancelada. Não é possível adicionar novas notas.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotasGestacaoModal;
