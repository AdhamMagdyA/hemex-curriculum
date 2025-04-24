const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryController");
const auth = require("../../middlewares/auth");
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require("../../middlewares/validation");

router.post(
  "/",
  auth("admin"),
  validateCreateCategory,
  categoryController.createCategory
);
router.put(
  "/:id",
  auth("admin"),
  validateUpdateCategory,
  categoryController.updateCategory
);
router.delete("/:id", auth("admin"), categoryController.deleteCategory);

module.exports = router;
