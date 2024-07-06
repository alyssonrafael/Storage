const express = require("express");
const {
  getDailySales,
  getMonthlySales,
  getAnnualSales,
  getTopCategoryOfMonth,
  getTotalSalesOfMonth,
  getProductsSoldByCategory,
  getProductsReport,
  getSalesReport,
  getUltimasVendas,
} = require("../controllers/relatoriosController");
// Criação de um novo roteador Express
const router = express.Router();
//rota para ver as vendas do dia
router.get("/relatorios/vendas-dia", getDailySales);
//rota para ver as vendas do mes
router.get("/relatorios/vendas-mes", getMonthlySales);
//rota para ver as vendas do ano
router.get("/relatorios/vendas-ano", getAnnualSales);
//rota para ver a categoria mais vendida do mes
router.get("/relatorios/categoria-top-mes", getTopCategoryOfMonth);
//rota para ver o valor totral de vendas no mes
router.get("/relatorios/total-vendas-mes", getTotalSalesOfMonth);
//rota para separar os produtos vendidos por categoria
router.get("/relatorios/produtos-vendidos-categoria", getProductsSoldByCategory);
//rota para ver detalhadamente a performace de cada produto
router.get("/relatorios/produtos", getProductsReport);
//rota para detalhadamente cada venda
router.get('/relatorios/vendas', getSalesReport);
// Rota para obter as últimas 4 vendas
router.get('/ultimas-vendas', getUltimasVendas);

module.exports = router;
