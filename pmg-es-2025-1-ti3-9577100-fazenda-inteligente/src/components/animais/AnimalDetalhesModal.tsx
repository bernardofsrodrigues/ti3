import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface AnimalDetalhesModalProps {
  open: boolean
  onClose: () => void
  animal: any | null
}

export function AnimalDetalhesModal({ open, onClose, animal }: AnimalDetalhesModalProps) {
  if (!animal) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Animal</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>Nome:</strong> {animal.name}</p>
          <p><strong>Tag:</strong> {animal.tag}</p>
          <p><strong>Raça:</strong> {animal.breed}</p>
          <p><strong>Categoria:</strong> {animal.category}</p>
          <p><strong>Sexo:</strong> {animal.gender}</p>
          <p><strong>Data de Nascimento:</strong> {animal.birth_date}</p>
          <p><strong>Peso:</strong> {animal.weight} kg</p>
          <p><strong>Status:</strong> {animal.status}</p>
          <p><strong>Pastagem:</strong> {animal.pastagem?.name || '—'}</p>
        </div>

        {animal.bezerros?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Bezerros Associados</h3>
            <ul className="mt-2 space-y-1">
              {animal.bezerros.map((b: any) => (
                <li key={b.id} className="flex justify-between items-center border rounded px-3 py-1">
                  <span>{b.name} ({b.tag})</span>
                  <Badge variant="outline">{b.category}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

}