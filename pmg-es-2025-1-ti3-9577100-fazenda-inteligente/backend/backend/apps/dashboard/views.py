from datetime import datetime, timedelta
from django.db.models import Avg, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from backend.apps.usuarios.permissions import SomenteAdminSistemaOuUsuarioDaFazenda
from backend.apps.animais.models import Animal
from backend.apps.vacinas.models import Vacina
from backend.apps.reproducao.models import Nascimento
from backend.apps.pesagens.models import Pesagem

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, SomenteAdminSistemaOuUsuarioDaFazenda]

    def get(self, request):
        user = request.user
        if user.tipo == 'admin_sistema' or not user.fazenda:
            return Response({'detail': 'Acesso negado.'}, status=403)

        fazenda = user.fazenda
        hoje = datetime.today()
        ano_atual = hoje.year

        # Métricas principais
        total_animais = Animal.objects.filter(fazenda=fazenda, status='Ativo').count()
        peso_medio   = Animal.objects.filter(fazenda=fazenda, status='Ativo').aggregate(avg=Avg('weight'))['avg'] or 0
        vacinas_pendentes = Vacina.objects.filter(
            animal__fazenda=fazenda,
            date__range=[hoje, hoje + timedelta(days=15)]
        ).count()

        total_partos_ano = Nascimento.objects.filter(
            mother__fazenda=fazenda,
            date__year=ano_atual
        ).count()
        taxa_natalidade = (total_partos_ano / total_animais * 100) if total_animais else 0

        # Distribuição de Raças
        distribuicao_raca = Animal.objects.filter(
            fazenda=fazenda, status='Ativo'
        ).values('breed').annotate(total=Count('id')).order_by('-total')

        # Nascimentos por Mês (partos)
        nascimentos_por_mes = Nascimento.objects.filter(
            mother__fazenda=fazenda,
            date__year=ano_atual
        ).extra({'mes': "strftime('%%m', date)"}) \
         .values('mes').annotate(total=Count('id')).order_by('mes')

        # Evolução de Peso
        evolucao_peso = Pesagem.objects.filter(
            animal__fazenda=fazenda,
            date__year=ano_atual
        ).extra({'mes': "strftime('%%m', date)"}) \
         .values('mes').annotate(avg=Avg('weight')).order_by('mes')

        # Taxa de Natalidade por Ano (reagrupado)
        raw = Nascimento.objects.filter(mother__fazenda=fazenda) \
            .extra({'ano': "strftime('%%Y', date)"}) \
            .values('ano').annotate(partos=Count('id')).order_by('ano')

        taxa_natalidade_anos = []
        for entry in raw:
            ano = int(entry['ano'])
            partos = entry['partos']
            # calculamos taxa relativa ao total de animais ativos
            taxa = (partos / total_animais * 100) if total_animais else 0
            taxa_natalidade_anos.append({
                'ano': entry['ano'],
                'partos': partos,
                'taxa': round(taxa, 2)
            })

        # Eventos futuros
        eventos = []
        for v in Vacina.objects.filter(animal__fazenda=fazenda, date__gte=hoje).order_by('date')[:10]:
            eventos.append({
                'id': f'vacina-{v.id}',
                'title': f'Vacina – {v.vaccine}',
                'date': v.date,
                'type': 'vaccination'
            })
        for n in Nascimento.objects.filter(mother__fazenda=fazenda, date__gte=hoje).order_by('date')[:10]:
            eventos.append({
                'id': f'parto-{n.id}',
                'title': f'Parto programado – {n.mother.name}',
                'date': n.date,
                'type': 'reproduction'
            })

        return Response({
            'total_animais': total_animais,
            'peso_medio': round(peso_medio, 2),
            'vacinas_pendentes': vacinas_pendentes,
            'taxa_natalidade': round(taxa_natalidade, 2),
            'distribuicao_raca': list(distribuicao_raca),
            'nascimentos_por_mes': list(nascimentos_por_mes),
            'evolucao_peso': list(evolucao_peso),
            'taxa_natalidade_anos': taxa_natalidade_anos,
            'eventos': eventos
        })
