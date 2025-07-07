
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirecionamos para o Dashboard, pois a rota principal está configurada lá
  return <Navigate to="/" replace />;
};

export default Index;
