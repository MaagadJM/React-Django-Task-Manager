from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import WhitelistTokenObtainView

urlpatterns = [
    path('api/auth/login/',   WhitelistTokenObtainView.as_view(), name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(),         name='token_refresh'),
    path('api/', include('tasks.urls')),
]