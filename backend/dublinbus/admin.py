from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'username', 'is_staff', 'is_active', 'is_superuser', 'auth_provider', 'id', 'image', 'map')
    list_filter = ('email', 'is_staff', 'is_active', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'is_superuser')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(Stop)
admin.site.register(StopTime)
admin.site.register(Route)
admin.site.register(Calendar)
admin.site.register(Trip)
admin.site.register(Line)
admin.site.register(FavoriteStop)
admin.site.register(FavoriteJourney)
admin.site.register(FavoriteLine)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Marker)
admin.site.register(Theme)
admin.site.register(FeedbackQuestion)
admin.site.register(FeedbackAnswer)

