from django.db import models
from backend.apps.usuarios.models import Fazenda

class Pastagem(models.Model):
    STATUS = [
        ('Ótimo', 'Ótimo'),
        ('Bom', 'Bom'),
        ('Regular', 'Regular'),
        ('Em Recuperação', 'Em Recuperação'),
    ]

    fazenda = models.ForeignKey(Fazenda, on_delete=models.CASCADE, related_name='pastagens')
    name = models.CharField(max_length=100)
    area = models.FloatField()
    capacity = models.IntegerField()
    current = models.IntegerField()
    status = models.CharField(max_length=50, choices=STATUS)
    last_rotation = models.DateField()

    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.name

class FonteAgua(models.Model):
    TIPOS = [
        ('Açude', 'Açude'),
        ('Rio', 'Rio'),
        ('Poço', 'Poço'),
    ]
    STATUS = [
        ('Adequado', 'Adequado'),
        ('Baixo', 'Baixo'),
    ]

    fazenda = models.ForeignKey(Fazenda, on_delete=models.CASCADE, related_name='fontes_agua')
    name = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50, choices=TIPOS)
    capacity = models.IntegerField(null=True, blank=True)
    current = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS)

    def __str__(self):
        return self.name