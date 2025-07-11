# Generated by Django 5.2.1 on 2025-06-01 21:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('animais', '0004_animal_pastagem'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inseminacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bull', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('status', models.CharField(max_length=20)),
                ('expected_birth', models.DateField()),
                ('animal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inseminacoes', to='animais.animal')),
            ],
        ),
        migrations.CreateModel(
            name='Nascimento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('father', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('number_of_calves', models.IntegerField()),
                ('calves_ids', models.JSONField()),
                ('mother', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nascimentos', to='animais.animal')),
            ],
        ),
    ]
