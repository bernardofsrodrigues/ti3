'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
  inseminacaoId: number | null;
  onSuccess: () => void;
}

const CancelarInseminacaoModal: React.FC<Props> = ({ open, onClose, inseminacaoId, onSuccess }) => {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancelar = async () => {
    if (!inseminacaoId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/reproducao/inseminacoes/${inseminacaoId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Cancelada',
          cancel_reason: motivo,
        }),
      });

      setMotivo('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao cancelar inseminação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Inseminação</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Motivo do cancelamento</Label>
          <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={4} />
          <Button onClick={handleCancelar} disabled={loading || motivo.length < 5} className="w-full">
            Confirmar Cancelamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelarInseminacaoModal;