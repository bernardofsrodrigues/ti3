from rest_framework import serializers
from .models import Animal
from backend.apps.pastagens.serializers import PastagemSerializer
from backend.apps.pastagens.models import Pastagem

class BezerroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'name', 'tag', 'category', 'gender', 'birth_date']

class AnimalSerializer(serializers.ModelSerializer):
    pastagem = PastagemSerializer(read_only=True)
    pastagem_id = serializers.PrimaryKeyRelatedField(
        queryset=Pastagem.objects.all(), write_only=True, source='pastagem'
    )
    bezerros = BezerroSerializer(many=True, read_only=True)

    pastagem_nome = serializers.CharField(source='pastagem.nome', read_only=True)
    sexo_display = serializers.CharField(source='get_gender_display', read_only=True)
    categoria_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Animal
        fields = '__all__'