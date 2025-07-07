import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { LogIn, User, Key, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  username: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
  
    fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: values.username, password: values.password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao autenticar');
        return res.json();
      })
      .then(async (data) => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
  
        const res = await fetch('http://localhost:8000/api/usuarios/usuarios/me/', {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });
  
        if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
        const user = await res.json();
  
        localStorage.setItem('tipo_usuario', user.tipo);
        localStorage.setItem('usuario', JSON.stringify(user));
        if (user && user.fazenda) {
          localStorage.setItem('fazenda', user.fazenda.nome);
          localStorage.setItem('fazenda_id', String(user.fazenda.id));
        } else {
          localStorage.removeItem('fazenda');
          localStorage.removeItem('fazenda_id');
        }
      
        toast({ title: "Login realizado com sucesso." });
  
        if (user.tipo === 'admin_sistema') {
          navigate('/painel-controle');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.error(err);
        setLoginError("Credenciais inválidas ou acesso não autorizado");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Fazenda</span>
            <span>Inteligente</span>
          </h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Rebanho</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          type="email"
                          placeholder="nome@fazenda.com"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Senha
                        </FormLabel>
                        <a href="#" className="text-xs text-primary hover:underline">
                          Esqueceu a senha?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          type="password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Lembrar-me
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Carregando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Entrar
                    </span>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <Button variant="link" onClick={() => navigate('/')} className="text-sm">
                    Voltar para página inicial
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
