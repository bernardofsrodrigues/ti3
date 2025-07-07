import { Navigate } from "react-router-dom";
import React from "react";

interface TipoUsuarioRouteProps {
  children: React.ReactNode;
  permitidos: string[];
}

const getTipoUsuario = (): string | null => {
  try {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data).tipo : null;
  } catch {
    return null;
  }
};

const TipoUsuarioRoute: React.FC<TipoUsuarioRouteProps> = ({ children, permitidos }) => {
  const tipo = getTipoUsuario();
  return permitidos.includes(tipo || '') ? <>{children}</> : <Navigate to="/unauthorized" />;
};

export default TipoUsuarioRoute;