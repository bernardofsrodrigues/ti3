from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Animal
from .serializers import AnimalSerializer
from backend.apps.usuarios.permissions import SomenteAdminSistemaOuUsuarioDaFazenda
from datetime import date
from dateutil.relativedelta import relativedelta

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [permissions.IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    def get_queryset(self):
        user = self.request.user

        if user.tipo == 'admin_sistema':
            return Animal.objects.all()
        if user.fazenda:
            fazenda_usuario =  Animal.objects.filter(fazenda=user.fazenda)
            self._atualizar_categorias_animais()
            return fazenda_usuario
        raise PermissionDenied("Usuário sem fazenda associada.")

    def perform_create(self, serializer):
        user = self.request.user

        if user.tipo == 'admin_sistema':
            raise PermissionDenied("Usuário admin_sistema não pode criar registros de animais.")
        try:
            serializer.save(fazenda=self.request.user.fazenda, status='Ativo')
        except Exception as e:
            print("Erro ao salvar:", e)
            raise

    def perform_update(self, serializer):
        instance = serializer.save()

        if instance.status in ["Vendido", "Morto"]:
             
            instance.pesagens.all().delete()
            instance.vacinacoes.all().delete()
            instance.inseminacoes.all().delete()
            instance.nascimentos.all().delete()

    def _atualizar_categorias_animais(self):
        seis_meses_atras = date.today() - relativedelta(months=6)
        bezerros = Animal.objects.filter(category='Bezerro', birth_date__lte=seis_meses_atras)

        for animal in bezerros:
            nova_categoria = None
            if animal.gender == 'Macho':
                nova_categoria = 'Novilho'
            elif animal.gender == 'Fêmea':
                nova_categoria = 'Novilha'
            if nova_categoria:
                animal.category = nova_categoria
                animal.save(update_fields=['category'])        