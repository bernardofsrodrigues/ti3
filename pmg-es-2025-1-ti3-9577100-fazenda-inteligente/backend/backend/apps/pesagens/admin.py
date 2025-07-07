from django.contrib import admin
from .models import Pesagem

@admin.register(Pesagem)
class PesagemAdmin(admin.ModelAdmin):
    list_display = ('animal', 'get_animal_name', 'get_animal_category', 'weight', 'get_weight_variation', 'date')
    search_fields = ('animal__name',)
    list_filter = ('date',)

    def get_animal_name(self, obj):
        return obj.animal.name
    get_animal_name.short_description = 'Nome'

    def get_animal_category(self, obj):
        return obj.animal.category
    get_animal_category.short_description = 'Categoria'

    def get_weight_variation(self, obj):
        return "±0"  
    get_weight_variation.short_description = 'Variação'