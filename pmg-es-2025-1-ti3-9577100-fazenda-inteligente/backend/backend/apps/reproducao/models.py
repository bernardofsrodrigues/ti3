from django.db import models
from backend.apps.animais.models import Animal

class Inseminacao(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='inseminacoes')
    bull = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=20)
    expected_birth = models.DateField()

    def __str__(self):
        return f"{self.animal.name} - {self.bull}"

class Nascimento(models.Model):
    mother = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='nascimentos')
    father = models.CharField(max_length=100)
    date = models.DateField()
    number_of_calves = models.IntegerField()
    calves_ids = models.JSONField()

    def __str__(self):
        return f"{self.mother.name} - {self.date}"