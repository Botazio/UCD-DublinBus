from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    """
    A subclass of the UserCreationForm so that they admin dashboard uses the CustomUser model.
    """
    class Meta:

        model = CustomUser
        fields = ('email',)


class CustomUserChangeForm(UserChangeForm):
    """
    A subclass of the UserChangeForm so that they admin dashboard uses the CustomUser model.
    """
    class Meta:
        model = CustomUser
        fields = ('email',)
