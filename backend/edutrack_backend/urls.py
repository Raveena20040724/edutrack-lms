from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/auth/',        include('apps.users.urls')),
    path('api/courses/',     include('apps.courses.urls')),
    path('api/assignments/', include('apps.assignments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
