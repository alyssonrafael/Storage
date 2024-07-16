import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../components/utils/tokenUtils";

// Definição da interface de props para ProtectedRoute
interface ProtectedRouteProps {
  acessControl: Array<"ADMIN" | "USER">; //array que pode conter essas duas string
  children?: React.ReactNode; // Filhos opcionais
}

// Componente funcional para rota protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  acessControl,
}) => {
  const token = localStorage.getItem("token"); // Resgata o token do local storage

  // Se o token não existir, redireciona para a página inicial
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = decodeToken(token); // Decodifica o token
  // Verifica se o token foi decodificado corretamente
  if (!decoded) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

    // Verifica se o token está expirado
    const currentTime = Date.now() / 1000; // Data e hora atuais em segundos
    if (decoded.exp && decoded.exp < currentTime) {
      alert("token expirado, fazer o login novamente")//alerta que vai ter que fazer login npvamente pois o token expirou
      localStorage.removeItem("token"); //remove o token 
      return <Navigate to="/" replace />; //redireciona para login
    }

  // Verifica se a role do usuário está no conjunto de roles permitidas array para permitir mais de uma role por pagina
  if (acessControl && !acessControl.includes(decoded.role)) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // Se o usuário for autenticado e tiver a role correta, renderiza os filhos
  return <>{children}</>;
};

export default ProtectedRoute;
