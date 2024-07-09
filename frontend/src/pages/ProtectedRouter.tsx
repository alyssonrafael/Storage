import React from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../components/utils/tokenUtils";

// Definição da interface de props para ProtectedRoute
interface ProtectedRouteProps {
  acessControl: "ADMIN" | "USER";
  children?: React.ReactNode; // Filhos opcionais
}
//componente funcional para rota protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  acessControl,
}) => {
  const token = localStorage.getItem("token"); //resgata o token do local storage

  // Se o token não existir, redireciona para a página inicial
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = decodeToken(token); //decodifica o token

  // Se a role do usuário não for permitida e ele tentar acessar essa rota, redireciona para a página inicial e romove o token
  if (acessControl && decoded.role !== acessControl) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // Se o usuário for autenticado e tiver a role correta, renderiza os filhos
  return <>{children}</>;
};

export default ProtectedRoute;
