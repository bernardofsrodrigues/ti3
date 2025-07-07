from rest_framework.routers import DefaultRouter
from .views import PastagemViewSet

router = DefaultRouter()
router.register(r'', PastagemViewSet, basename='pastagem')

urlpatterns = router.urls