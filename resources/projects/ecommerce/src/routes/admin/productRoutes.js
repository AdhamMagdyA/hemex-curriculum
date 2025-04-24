const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const auth = require("../../middlewares/auth");
const {
  validateUpdateProduct,
  validateCreateProduct,
  validateToggleProductStatus,
  validateProductQuery,
} = require("../../middlewares/validation");

router.get("/", 
  auth("admin"), 
  validateProductQuery, 
  productController.getAllProductsAdmin
);
router.post(
  "/",
  auth("admin"),
  validateCreateProduct,
  productController.createProduct
);
router.put(
  "/:id",
  auth("admin"),
  validateUpdateProduct,
  productController.updateProduct
);
router.delete("/:id", auth("admin"), productController.deleteProduct);
router.patch(
  "/:id/status",
  auth("admin"),
  validateToggleProductStatus,
  productController.toggleProductStatus
);

module.exports = router;
