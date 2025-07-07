from django.db import models
from backend.apps.animais.models import Animal

class Vacina(models.Model):
    STATUS_CHOICES = [
        ('Aplicada', 'Aplicada'),
        ('Pendente', 'Pendente'),
        ('Atrasada', 'Atrasada'),
    ]

    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='vacinacoes')
    name = models.CharField(max_length=100)
    date = models.DateField()
    next_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.animal.name} - {self.name}"