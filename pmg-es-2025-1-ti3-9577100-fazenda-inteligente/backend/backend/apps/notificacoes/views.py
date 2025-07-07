from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Notificacao
from .serializers import NotificacaoSerializer

class NotificacaoViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Notificacao.objects.filter(usuario=self.request.user)
        lida = self.request.query_params.get('lida')
        if lida is not None:
            queryset = queryset.filter(lida=lida.lower() == 'true')
        return queryset.order_by('-data_criacao')
    
    @action(detail=False, methods=['patch'], url_path='marcar-lidas')
    def marcar_notificacoes_como_lidas(self, request):
        Notificacao.objects.filter(usuario=request.user, lida=False).update(lida=True)
        return Response({'detalhe': 'Notificações marcadas como lidas.'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)