from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import WhitelistTokenObtainView, RegisterView

urlpatterns = [
    path('admin/',            admin.site.urls),
    path('api/auth/login/',   WhitelistTokenObtainView.as_view(), name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(),         name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(),            name='register'),
    path('api/', include('tasks.urls')),
]