
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold text-cattle-primary">404</div>
        <h1 className="text-3xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="bg-cattle-primary hover:bg-cattle-primary/90"
        >
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
