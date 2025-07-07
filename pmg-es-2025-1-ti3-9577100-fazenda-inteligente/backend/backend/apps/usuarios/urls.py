from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, FazendaViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'fazendas', FazendaViewSet, basename='fazenda')

urlpatterns = router.urls