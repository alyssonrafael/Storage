import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Componente que faz a proteção das rotas
import ProtectedRoute from "./pages/ProtectedRouter";
// Componentes das páginas do projeto
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import AccountEditing from "./pages/AccountEditing";
import About from "./pages/About";
import UserManagement from "./pages/UserManagement";

import ProtectedLayout from "./components/ProtectedLayout"; // Importe o layout protegido

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      {/* Rota para o login */}
      <Route path="/" element={<Login />} />
      {/* Rota para o cadastro */}
      <Route path="/register" element={<Register />} />
      {/* Rotas protegidas que recebem o layout padrao que tera as paginas filhas exibidas em uma seçao expecifica*/}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute acessControl={["USER", "ADMIN"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute acessControl={["USER", "ADMIN"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute acessControl={["USER", "ADMIN"]}>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute acessControl={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManagement"
          element={
            <ProtectedRoute acessControl={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accountediting"
          element={
            <ProtectedRoute acessControl={["USER", "ADMIN"]}>
              <AccountEditing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute acessControl={["USER", "ADMIN"]}>
              <About />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
