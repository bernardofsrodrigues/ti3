from django.contrib import admin

from .models import Animal

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ['tag', 'name', 'breed', 'category', 'gender', 'birth_date', 'get_pastagem', 'weight']
    search_fields = ['name', 'tag', 'breed']
    list_filter = ['gender', 'category', 'pastagem']

    def get_pastagem(self, obj):
        return obj.pastagem.nome if obj.pastagem else "-"
    get_pastagem.short_description = "Pastagem"
