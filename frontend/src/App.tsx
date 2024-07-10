import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//componente que faz a protaçao das rotas
import ProtectedRoute from "./pages/ProtectedRouter";

//componentes das paginas do projeto
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import AccountEditing from "./pages/AccountEditing";
import About from "./pages/About";

// Definição do componente AppRouter como uma função componente do React.
const AppRouter: React.FC = () => (
  /* Definição das rotas utilizando o componente Routes. */
  <Router>
    <Routes>
      {/* rota para o login */}
      <Route path="/" element={<Login />} />
      {/* rota para o cadastro */}
      <Route path="/register" element={<Register />} />
      {/* rota protegida para home*/}
      <Route
        path="/home"
        element={
          // verifica se o acesscontrol tem user ou adimin para retornar a rota de acordo com a role do user
          <ProtectedRoute acessControl={["USER", "ADMIN"]} > 
            <Home />
          </ProtectedRoute>
        }
      />
      {/* rota protegida para produtos*/}
      <Route
        path="/products"
        element={
          <ProtectedRoute acessControl={["USER", "ADMIN"]}>
            <Products />
          </ProtectedRoute>
        }
      />
      {/* rota protegida para vendas*/}
      <Route
        path="/sales"
        element={
          <ProtectedRoute acessControl={["USER", "ADMIN"]}>
            <Sales />
          </ProtectedRoute>
        }
      />
      {/* rota protegida para relatorios*/}
      <Route
        path="/reports"
        element={
          <ProtectedRoute acessControl={["USER", "ADMIN"]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      {/* rota protegida para ediçao de conta*/}
      <Route
        path="/accountediting"
        element={
          <ProtectedRoute acessControl={["USER", "ADMIN"]}>
            <AccountEditing />
          </ProtectedRoute>
        }
      />
      {/* rota protegida para sobre o projeto*/}
      <Route
        path="/about"
        element={
          <ProtectedRoute acessControl={["USER", "ADMIN"]}>
            <About />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
