const { PrismaClient } = require("@prisma/client"); //orm para interaçao com o banco de dados
const hashPassword = require("../utils/hashPassword");
const bcrypt = require('bcrypt');
//instanciaçao para interagir com o banco de dados
const prisma = new PrismaClient();

// Controlador para atualizar informaçoes de um usuário
const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar a senha atual, se fornecida
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Senha atual incorreta." });
      }
    }

    // Preparar os dados para atualização
    const updateData = {
      name,
      email,
    };

    // Atualizar a senha, se uma nova senha for fornecida
    if (newPassword) {
      updateData.password = await hashPassword(newPassword);
    }

    // Atualizar o usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Controlador para deletar um usuário
const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};

// Controlador para encontrar um usuário com base no id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

//   ------------------------------------------
// ADM
// Controlador para listar todos os usuários (restrito ao ADMIN)
const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
};

// Controlador para modificar a role de um usuário (restrito ao ADMIN)
const changeUserRole = async (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao modificar role do usuário." });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  listUsers,
  changeUserRole,
  getUserById,
};
