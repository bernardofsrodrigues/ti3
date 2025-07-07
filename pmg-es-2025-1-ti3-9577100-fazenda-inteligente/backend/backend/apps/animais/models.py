from django.db import models
from backend.apps.usuarios.models import Fazenda
from backend.apps.pastagens.models import Pastagem

class Animal(models.Model):
    CATEGORIAS = [
        ('Matriz', 'Matriz'),
        ('Reprodutor', 'Reprodutor'),
        ('Novilha', 'Novilha'),
        ('Novilho', 'Novilho'),
        ('Bezerro', 'Bezerro'),
    ]
    SEXOS = [
        ('Macho', 'Macho'),
        ('Fêmea', 'Fêmea'),
    ]

    pastagem = models.ForeignKey(
        Pastagem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='animais'
    )

    fazenda = models.ForeignKey(Fazenda, on_delete=models.CASCADE, related_name='animais')
    name = models.CharField(max_length=100)
    tag = models.CharField(max_length=50, unique=True)
    breed = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=SEXOS)
    birth_date = models.DateField()
    weight = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=20)
    category = models.CharField(max_length=50, choices=CATEGORIAS)
    pai_ou_mae = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bezerros'
    )

    def __str__(self):
        return f"{self.name} ({self.tag})"