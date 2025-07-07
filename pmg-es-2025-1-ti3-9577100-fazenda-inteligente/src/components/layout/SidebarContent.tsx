import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Home, Users, Calendar, Activity, Heart, Leaf,
  FileText, Settings, LogOut, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarContentProps {
  isSidebarOpen: boolean;
  onNavigate?: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isSidebarOpen: boolean;
  onNavigate?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isSidebarOpen, onNavigate }) => (
  <li>
    {isSidebarOpen ? (
      <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) => cn(
          "flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors",
          isActive && "bg-sidebar-accent/20 font-medium"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </NavLink>
    ) : (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => cn(
              "flex items-center justify-center h-12 w-12 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors mx-auto",
              isActive && "bg-sidebar-accent/20"
            )}
          >
            <Icon size={24} />
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )}
  </li>
);

const SidebarContent: React.FC<SidebarContentProps> = ({ isSidebarOpen, onNavigate }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await fetch('http://localhost:8000/api/usuarios/usuarios/me/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('fazenda_id');
    navigate('/login');
  };

  const renderNavItems = () => {
    if (!usuario) return null;
    const { tipo } = usuario;
    const items = [];

    if (tipo === 'admin_sistema') {
      items.push(<NavItem key="controle" to="/painel-controle" icon={Users} label="Painel de Controle" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />);
    }

    if (tipo === 'admin_fazenda') {
      items.push(
        <NavItem key="dashboard" to="/dashboard" icon={Home} label="Dashboard" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="animals" to="/animals" icon={Users} label="Animais" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="vaccination" to="/vaccination" icon={Calendar} label="Vacinação" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="weights" to="/weights" icon={Activity} label="Pesagens" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="reproduction" to="/reproduction" icon={Heart} label="Reprodução" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="pastures" to="/pastures" icon={Leaf} label="Pastagens" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        //<NavItem key="reports" to="/reports" icon={FileText} label="Relatórios" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />
      );
    }

    if (tipo === 'veterinario') {
      items.push(
        <NavItem key="animals" to="/animals" icon={Users} label="Animais" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="vaccination" to="/vaccination" icon={Calendar} label="Vacinação" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />
      );
    }

    if (tipo === 'funcionario') {
      items.push(
        <NavItem key="animals" to="/animals" icon={Users} label="Animais" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />,
        <NavItem key="weights" to="/weights" icon={Activity} label="Pesagens" isSidebarOpen={isSidebarOpen} onNavigate={onNavigate} />
      );
    }

    return items;
  };

  return (
      <div className="flex flex-col h-full justify-between">
        {/* Topo e navegação */}
        <div className="py-4 overflow-y-auto">
          <nav>
            <ul className={cn("space-y-3", !isSidebarOpen && "flex flex-col items-center px-0")}>
              {renderNavItems()}
            </ul>
          </nav>
    
          {(usuario?.tipo !== 'admin_sistema') && (
            <ul className={cn("mt-12 space-y-3", !isSidebarOpen && "flex flex-col items-center px-0")}>
              <NavItem
                to="/settings"
                icon={Settings}
                label="Configurações"
                isSidebarOpen={isSidebarOpen}
                onNavigate={onNavigate}
              />
            </ul>
          )}
        </div>
      
        {/* Rodapé fixo (perfil + sair) */}
        <div className="border-t border-sidebar-border py-4">
          {/* Perfil */}
          <div className={cn(
            "flex items-center text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors rounded-md",
            isSidebarOpen ? "px-4 py-2 mx-2" : "py-2 mx-auto justify-center"
          )}>
            {isSidebarOpen ? (
              <>
                <div className="w-8 h-8 rounded-full bg-sidebar-accent/30 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium truncate max-w-[10rem]">
                    {(usuario?.username?.length ?? 0) > 7
                      ? usuario.username.slice(0, 7) + '...'
                      : usuario?.username || 'Usuário'}
                    <span className="text-xs text-sidebar-foreground/60 ml-1">
                      ({usuario?.tipo?.replaceAll('_', ' ')})
                    </span>
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate max-w-[10rem]">
                    {usuario?.tipo === 'admin_sistema'
                      ? 'Administrador do Sistema'
                      : usuario?.fazenda?.nome || '—'}
                  </p>
                </div>
              </>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 rounded-full bg-sidebar-accent/30 flex items-center justify-center">
                    <User size={20} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Perfil do Usuário</TooltipContent>
              </Tooltip>
            )}
          </div>
        
          {/* Botão de sair */}
          <div
            onClick={() => {
              handleLogout();
              onNavigate?.(); // fecha o Drawer se for mobile
            }}
            className={cn(
              "flex items-center text-sidebar-foreground/80 cursor-pointer hover:bg-sidebar-accent/20 transition-colors rounded-md mt-2",
              isSidebarOpen ? "px-4 py-2 mx-2" : "justify-center py-2 mx-auto"
            )}
          >
            {isSidebarOpen ? (
              <>
                <LogOut size={20} />
                <span className="ml-2">Sair</span>
              </>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <LogOut size={24} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Sair</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    );
};

export default SidebarContent;