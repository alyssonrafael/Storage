// Importa o PrismaClient do pacote @prisma/client, jwt do pacote jsonwebtoken e bcrypt do pacote bcrypt
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hashPassword = require("../utils/hashPassword");

// Inicializa uma nova instância do PrismaClient
const prisma = new PrismaClient();
// Pega a chave secreta do ambiente de variáveis
const secretKey = process.env.SECRET_KEY;

// Função para registrar um novo usuário
const register = async (req, res) => {
  // Extrai os dados do corpo da requisição
  const { name, email, password, role } = req.body;
  // Gera um hash da senha do usuário
  const hashedPassword = await hashPassword(password);

  try {
    // Cria um novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    // Responde com o usuário criado e status 201 (Created)
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para logar um usuário
const login = async (req, res) => {
  // Extrai os dados do corpo da requisição
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo email no banco de dados
    const user = await prisma.user.findUnique({ where: { email } });

    // Verifica se o usuário existe e se a senha fornecida corresponde à senha armazenada
    if (user && (await bcrypt.compare(password, user.password))) {
      // Gera um token JWT com o ID e role do usuário, expira em 1 hora
      const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
        expiresIn: "1h",
      });
      // Responde com o token e o role do usuário
      res.json({ token, role: user.role });
    } else {
      // Se o email ou senha estiverem incorretos, responde com status 401 (Unauthorized) e mensagem de erro
      res.status(401).json({ error: "email ou senha invalido" });
    }
  } catch (error) {
    // Em caso de erro, responde com status 400 (Bad Request) e a mensagem de erro
    res.status(400).json({ error: error.message });
  }
};

// Exporta as funções register e login
module.exports = { register, login };
