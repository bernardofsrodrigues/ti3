import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, LogIn, ArrowRight } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      try {
        setUsuario(JSON.parse(data));
      } catch {
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const redirecionar = () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    switch (usuario.tipo) {
      case 'admin_sistema':
        navigate('/painel-controle');
        break;
      case 'admin_fazenda':
        navigate('/dashboard');
        break;
      case 'veterinario':
      case 'funcionario':
        navigate('/animals');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Acesso Negado</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {!usuario ? (
            <>
              <p className="text-muted-foreground">
                Você precisa estar autenticado para acessar esta página.
              </p>
              <p>Por favor, faça login para continuar navegando no sistema.</p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
              </p>
              <p>Redirecione-se para uma área permitida do sistema.</p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Button
            size="lg"
            onClick={redirecionar}
            className="gap-2"
          >
            {usuario ? <ArrowRight className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            {usuario ? 'Ir para minha página inicial' : 'Ir para o Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
