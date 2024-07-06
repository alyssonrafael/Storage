const express = require("express");
const { newVenda, getVendas, getVendaById, deleteVenda} = require("../controllers/vendasController");

const router = express.Router();

// Rota para atualizar o nome do usuário
router.post("/vendas", newVenda );
//rota para listar as vendas
router.get("/vendas", getVendas);
//rota para venda especifica
router.get("/venda/:id", getVendaById );
//funçao para deletar a venda e retornar os produtos ao estoque
router.delete("/venda/:id", deleteVenda )


module.exports = router;