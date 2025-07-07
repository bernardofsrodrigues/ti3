from rest_framework import viewsets, permissions
from .models import Inseminacao, Nascimento
from .serializers import InseminacaoSerializer, NascimentoSerializer
from rest_framework.exceptions import PermissionDenied
from backend.apps.usuarios.permissions import SomenteAdminSistemaOuUsuarioDaFazenda
from backend.apps.animais.models import Animal
from datetime import date

class InseminacaoViewSet(viewsets.ModelViewSet):
    serializer_class = InseminacaoSerializer
    permission_classes = [permissions.IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin_sistema':
            return Inseminacao.objects.all()
        return Inseminacao.objects.filter(animal__fazenda=user.fazenda)

    def perform_create(self, serializer):
        animal = serializer.validated_data['animal']
        if self.request.user.tipo != 'admin_sistema' and animal.fazenda != self.request.user.fazenda:
            raise PermissionDenied("Você não tem permissão para registrar inseminação para este animal.")
        serializer.save()

class NascimentoViewSet(viewsets.ModelViewSet):
    serializer_class = NascimentoSerializer
    permission_classes = [permissions.IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin_sistema':
            return Nascimento.objects.all()
        return Nascimento.objects.filter(mother__fazenda=user.fazenda)

    def perform_create(self, serializer):
        user = self.request.user
        mae = serializer.validated_data['mother']

        # Verificação de permissão por fazenda
        if user.tipo != 'admin_sistema' and mae.fazenda != user.fazenda:
            raise PermissionDenied("Você não tem permissão para registrar nascimento para este animal.")

        nascimento = serializer.save()

        # Criar automaticamente os bezerros
        calves = []
        for i in range(nascimento.number_of_calves):
            tag = f"BZ-{nascimento.id:04}-{i+1}"
            bezerro = Animal.objects.create(
                name=f"Bezerro {nascimento.id}-{i+1}",
                tag=tag,
                breed=mae.breed,
                category='Bezerro',
                gender='Macho' if i % 2 == 0 else 'Fêmea',
                birth_date=nascimento.date or date.today(),
                weight=35,
                status='Ativo',
                fazenda=mae.fazenda,
                pai_ou_mae=mae
            )
            calves.append(bezerro.tag)

        nascimento.calves_ids = calves
        nascimento.save()
