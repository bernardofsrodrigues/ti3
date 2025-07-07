from backend.apps.usuarios.models import Usuario
from .models import Notificacao

def notificar_usuarios_da_fazenda(fazenda, titulo: str, mensagem: str, tipos_usuario: list[str]):
    """
    Cria notificações para todos os usuários de uma fazenda que sejam de um dos tipos especificados.

    :param fazenda: Fazenda à qual os usuários pertencem
    :param titulo: Título da notificação
    :param mensagem: Mensagem da notificação
    :param tipos_usuario: Lista de tipos de usuário que devem receber a notificação
    """
    usuarios = Usuario.objects.filter(fazenda=fazenda, tipo__in=tipos_usuario)
    notificacoes = [
        Notificacao(usuario=u, titulo=titulo, mensagem=mensagem)
        for u in usuarios
    ]
    Notificacao.objects.bulk_create(notificacoes)