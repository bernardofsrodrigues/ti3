from rest_framework import serializers
from .models import Inseminacao, Nascimento

class InseminacaoSerializer(serializers.ModelSerializer):
    animal_nome = serializers.CharField(source='animal.name', read_only=True)

    class Meta:
        model = Inseminacao
        fields = '__all__'

class NascimentoSerializer(serializers.ModelSerializer):
    mae_nome = serializers.CharField(source='mae.name', read_only=True)

    class Meta:
        model = Nascimento
        fields = '__all__'