from django.contrib import admin
from django.urls import path, include
from backend.apps.usuarios.token_view import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Auth
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Apps
    path('api/animais/', include('backend.apps.animais.urls')),
    path('api/vacinas/', include('backend.apps.vacinas.urls')),
    path('api/pesagens/', include('backend.apps.pesagens.urls')),
    path('api/reproducao/', include('backend.apps.reproducao.urls')),
    path('api/pastagens/', include('backend.apps.pastagens.urls')),
    path('api/usuarios/', include('backend.apps.usuarios.urls')),
    path('api/dashboard/', include('backend.apps.dashboard.urls')),

    # Caso queira painel de métricas posteriormente
    # path('api/dashboard/', include('apps.dashboard.urls')),
]