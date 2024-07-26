const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const vendasRoutes = require('./routes/vendasRouter');
const relatoriosRoutes = require('./routes/relatoriosRoutes')

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors({
  origin: 'http://localhost:4173' // Permitir meu front end local de build
}));
app.use(express.json());

// Routes
app.use('/api', authRoutes, userRoutes, categoriaRoutes, produtoRoutes, vendasRoutes, relatoriosRoutes);

// Teste de conexão com o banco de dados
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

// Inicialização do servidor e o teste de conecxao
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testDatabaseConnection();
});