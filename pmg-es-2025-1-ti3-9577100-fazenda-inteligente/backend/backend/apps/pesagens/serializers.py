from rest_framework import serializers
from .models import Pesagem

class PesagemSerializer(serializers.ModelSerializer):
    animal_nome = serializers.CharField(source='animal.name', read_only=True)
    animal_categoria = serializers.CharField(source='animal.category', read_only=True)

    class Meta:
        model = Pesagem
        fields = '__all__'