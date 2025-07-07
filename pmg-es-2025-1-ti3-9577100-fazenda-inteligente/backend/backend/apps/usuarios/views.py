from rest_framework import viewsets, permissions
from .models import Usuario, Fazenda
from .serializers import UsuarioSerializer, FazendaSerializer, UsuarioUpdateSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class FazendaViewSet(viewsets.ModelViewSet):
    serializer_class = FazendaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Fazenda.objects.all() if user.tipo == 'admin_sistema' else Fazenda.objects.filter(id=user.fazenda.id)

class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.tipo == 'admin_sistema':
            return Usuario.objects.all()
        return Usuario.objects.filter(fazenda=user.fazenda)

    def perform_create(self, serializer):
        if self.request.user.tipo != 'admin_sistema':
            serializer.save(fazenda=self.request.user.fazenda)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        usuario = request.user
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)        
    
    @action(detail=False, methods=['patch'], url_path='me/update')
    def update_me(self, request):
        usuario = request.user
        serializer = UsuarioUpdateSerializer(usuario, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Perfil atualizado com sucesso."})