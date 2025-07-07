from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Fazenda

@admin.register(Usuario)
class CustomUsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Informações da Fazenda", {"fields": ("fazenda", "tipo")}),
    )
    list_display = ("username", "email", "tipo", "fazenda", "is_staff", "is_active")
    list_filter = ("tipo", "fazenda", "is_staff")
    search_fields = ("email", "username")

@admin.register(Fazenda)
class FazendaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome")
    search_fields = ("nome",)