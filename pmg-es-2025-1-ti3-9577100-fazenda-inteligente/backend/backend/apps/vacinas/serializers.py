from rest_framework import serializers
from .models import Vacina

class VacinaSerializer(serializers.ModelSerializer):
    animal_nome = serializers.CharField(source='animal.name', read_only=True)

    class Meta:
        model = Vacina
        fields = '__all__'