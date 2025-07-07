import TipoUsuarioRoute from './PrivateRoute';
import Unauthorized from "./pages/Unauthorized";
import Presentation from "./pages/Presentations";
import PainelControle from "./pages/PainelControle";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/hooks/useTheme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts e páginas
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import Vaccination from "./pages/Vaccination";
import Weights from "./pages/Weights";
import Reproduction from "./pages/Reproduction";
import Pastures from "./pages/Pastures";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/UserSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Presentation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda', 'funcionario', 'veterinario', 'admin_sistema']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route
              path="/animals"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda', 'funcionario', 'veterinario']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Animals />} />
            </Route>
            
            <Route
              path="/weights"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda', 'funcionario']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Weights />} />
            </Route>
            
            <Route
              path="/vaccination"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda', 'veterinario']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Vaccination />} />
            </Route>
            
            <Route
              path="/dashboard"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>
            
            <Route
              path="/reproduction"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Reproduction />} />
            </Route>
            
            <Route
              path="/pastures"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Pastures />} />
            </Route>
            
            <Route
              path="/reports"
              element={
                <TipoUsuarioRoute permitidos={['admin_fazenda']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<Reports />} />
            </Route>
            
            <Route
              path="/painel-controle"
              element={
                <TipoUsuarioRoute permitidos={['admin_sistema']}>
                  <Layout />
                </TipoUsuarioRoute>
              }
            >
              <Route index element={<PainelControle />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
