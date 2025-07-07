from django.db import models
from backend.apps.animais.models import Animal

class Pesagem(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='pesagens')
    weight = models.DecimalField(max_digits=6, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.animal.name} - {self.date}"