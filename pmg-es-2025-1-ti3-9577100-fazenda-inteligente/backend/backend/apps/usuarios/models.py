from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

class Fazenda(models.Model):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

class Usuario(AbstractUser):
    TIPO_CHOICES = (
        ('admin_sistema', 'Administrador do Sistema'),
        ('admin_fazenda', 'Administrador da Fazenda'),
        ('funcionario', 'Funcionário'),
        ('veterinario', 'Veterinário'),
    )
    fazenda = models.ForeignKey(Fazenda, on_delete=models.CASCADE, null=True, blank=True)
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES, default='admin_sistema')

    def clean(self):
        super().clean()
        if self.tipo == 'admin_sistema' and self.fazenda is not None:
            raise ValidationError("Usuários do tipo admin_sistema não podem estar associados a uma fazenda.")