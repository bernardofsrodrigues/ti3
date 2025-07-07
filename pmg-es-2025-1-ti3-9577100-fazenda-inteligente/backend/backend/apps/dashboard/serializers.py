from rest_framework import serializers
from backend.apps.vacinas.models import Vacina


class DashboardVacinasHojeSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source='animal.name', read_only=True)
    vacina_name = serializers.CharField(source='name', read_only=True)
    status = serializers.CharField(read_only=True)
    next_date = serializers.DateField(read_only=True)

    class Meta:
        model = Vacina
        fields = ['animal_name', 'vacina_name', 'status', 'next_date']
