from rest_framework import serializers
from .models import Pastagem, FonteAgua

class PastagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pastagem
        fields = '__all__'
        read_only_fields = ['fazenda']

    def validate(self, data):
        if self.instance is None:  # Criação
            if data.get("latitude") is None or data.get("longitude") is None:
                raise serializers.ValidationError("Latitude e longitude são obrigatórios.")
        return data    

class FonteAguaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FonteAgua
        fields = '__all__'