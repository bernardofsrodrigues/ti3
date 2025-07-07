from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona campos extras no payload do token
        token['tipo'] = user.tipo
        if user.fazenda:
            token['fazenda_id'] = user.fazenda.id
        else:
            token['fazenda_id'] = None

        print(f"Token gerado para o usuário {user.username}: {token}")
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['tipo'] = self.user.tipo
        data['fazenda_id'] = self.user.fazenda.id if self.user.fazenda else None

        print(f"Dados de validação: {data}")
        return data
