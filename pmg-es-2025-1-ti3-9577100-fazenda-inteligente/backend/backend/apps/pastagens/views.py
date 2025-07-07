from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import Pastagem
from .serializers import PastagemSerializer
from backend.apps.usuarios.permissions import SomenteAdminSistemaOuUsuarioDaFazenda

class PastagemViewSet(viewsets.ModelViewSet):
    serializer_class = PastagemSerializer
    permission_classes = [permissions.IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    @action(detail=False, methods=['get'])
    def da_fazenda(self, request):
        user = request.user
        if user.tipo == 'admin_sistema':
            return Response([])

        pastagens = Pastagem.objects.filter(fazenda=user.fazenda)
        serializer = self.get_serializer(pastagens, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin_sistema':
            return Pastagem.objects.all()
        return Pastagem.objects.filter(fazenda=user.fazenda)

    def perform_create(self, serializer):
        serializer.save(fazenda=self.request.user.fazenda)