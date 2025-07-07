from rest_framework import viewsets, permissions
from .models import Vacina
from .serializers import VacinaSerializer
from rest_framework.exceptions import PermissionDenied
from backend.apps.usuarios.permissions import SomenteAdminSistemaOuUsuarioDaFazenda

class VacinaViewSet(viewsets.ModelViewSet):
    serializer_class = VacinaSerializer
    permission_classes = [permissions.IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin_sistema':
            return Vacina.objects.all()
        return Vacina.objects.filter(animal__fazenda=user.fazenda)

    def perform_create(self, serializer):
        animal = serializer.validated_data['animal']
        if self.request.user.tipo != 'admin_sistema' and animal.fazenda != self.request.user.fazenda:
            raise PermissionDenied("Você não tem permissão para registrar vacina para este animal.")
        serializer.save()