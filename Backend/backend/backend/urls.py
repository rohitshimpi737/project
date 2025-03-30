from django.urls import path, include

urlpatterns = [    
    # Authentication Endpoints
    path('api/', include('auth_app.urls')),    
]
