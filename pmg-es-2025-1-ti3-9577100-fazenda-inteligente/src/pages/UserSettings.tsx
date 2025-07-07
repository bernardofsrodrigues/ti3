import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      const parsed = JSON.parse(data);
      setUserData({ username: parsed.username, email: parsed.email, password: '' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const response = await fetch('http://localhost:8000/api/usuarios/usuarios/me/update/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      toast({ title: "Dados atualizados com sucesso." });
    } else {
      toast({ variant: "destructive", title: "Erro ao atualizar dados." });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Configurações da Conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Username</label>
          <Input
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Nova Senha</label>
          <Input
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>
        <Button type="submit" className="bg-cattle-primary text-white">Salvar Alterações</Button>
      </form>
    </div>
  );
};

export default Settings;
