from rest_framework import permissions

class SomenteAdminSistemaOuUsuarioDaFazenda(permissions.BasePermission):
    """
    Permite acesso total ao admin_sistema.
    Restringe acesso aos dados da própria fazenda para os demais usuários.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin do sistema tem acesso total
        if request.user.tipo == 'admin_sistema':
            return True

        # Caso o objeto tenha atributo 'fazenda'
        if hasattr(obj, 'fazenda'):
            return obj.fazenda == request.user.fazenda

        # Se não tiver o campo fazenda, nega por segurança
        return False
