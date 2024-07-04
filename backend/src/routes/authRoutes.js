const express = require("express");
const  { register, login } = require("../controllers/authController");
const authenticateJWT = require("../middlewares/authenticateJWT");
// Criação de um novo roteador Express
const router = express.Router();

// Rota POST para registro de usuários
// Quando a rota '/register' é acessada, a função 'register'
router.post("/register", register);

// Rota POST para login de usuários
// Quando a rota '/login' é acessada, a função 'login' é chamada
router.post("/login", login);

// Rota GET para o painel do usuário
// A função 'authenticateJWT' é usada como middleware para verificar se o usuário está autenticado
// Se o usuário tiver a role 'USER', ele terá acesso ao painel do usuário
router.get("/user-dashboard", authenticateJWT, (req, res) => {
  if (req.user.role === "USER") {
    // Resposta com uma mensagem de boas-vindas ao painel do usuário
    res.json({ message: "Welcome to the user dashboard!" });
  } else {
    // Se o usuário não tiver a role 'USER', ele receberá um status 403 (Proibido)
    res.sendStatus(403);
  }
});
// Rota GET para o painel do administrador
// A função 'authenticateJWT' é usada como middleware para verificar se o usuário está autenticado
// Se o usuário tiver a role 'ADMIN', ele terá acesso ao painel do administrador
router.get("/admin-dashboard", authenticateJWT, (req, res) => {
  if (req.user.role === "ADMIN") {
    // Resposta com uma mensagem de boas-vindas ao painel do administrador
    res.json({ message: "Welcome to the admin dashboard!" });
  } else {
    // Se o usuário não tiver a role 'ADMIN', ele receberá um status 403 (Proibido)
    res.sendStatus(403);
  }
});

module.exports = router;
