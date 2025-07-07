from rest_framework.routers import DefaultRouter
from .views import PesagemViewSet

router = DefaultRouter()
router.register(r'', PesagemViewSet, basename='pesagem')

urlpatterns = router.urls