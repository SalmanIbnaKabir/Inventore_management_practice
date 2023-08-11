const express = require("express");
const stockController = require("../controllers/stock.controller");
const router = express.Router();

// router.route("/bulk-update").patch(productController.bulkUpdateProduct);
// router.route("/bulk-delete").delete(productController.bulkDeleteProduct);

router
  .route("/")
  .get(stockController.getStocks)
  .post(stockController.createStock);

router
  .route("/:id")
  .get(stockController.getStockById)
  .patch(stockController.updateStockById)
  .delete(stockController.deleteStockById);

module.exports = router;
