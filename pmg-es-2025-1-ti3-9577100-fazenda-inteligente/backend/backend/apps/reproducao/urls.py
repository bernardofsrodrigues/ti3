from rest_framework.routers import DefaultRouter
from .views import InseminacaoViewSet, NascimentoViewSet

router = DefaultRouter()
router.register(r'inseminacoes', InseminacaoViewSet, basename='inseminacao')
router.register(r'nascimentos', NascimentoViewSet, basename='nascimento')

urlpatterns = router.urls