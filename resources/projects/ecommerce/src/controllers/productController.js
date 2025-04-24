const ApiError = require('../errors/ApiError');
const apiResponse = require('../utils/apiResponse');
const productService = require('../services/productService');

class ProductController {
  // Customer endpoints
  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      apiResponse(res, 200, true, result, 'Products retrieved successfully');
    } catch (error) {
      const status = error.statusCode || 500;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      apiResponse(res, 200, true, product, 'Product retrieved successfully');
    } catch (error) {
      const status = error.statusCode || 500;
      apiResponse(res, status, false, null, error.message);
    }
  }

  // Admin endpoints
  async getAllProductsAdmin(req, res) {
    try {
      const result = await productService.getAllProductsForAdmin(req.query);
      apiResponse(res, 200, true, result, 'Products retrieved successfully');
    } catch (error) {
      const status = error.statusCode || 500;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      apiResponse(res, 201, true, product, 'Product created successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      apiResponse(res, 200, true, product, 'Product updated successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      apiResponse(res, 204, true, null, 'Product deleted successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async toggleProductStatus(req, res) {
    try {
      const product = await productService.toggleProductActiveStatus(
        req.params.id,
        req.body.isActive
      );
      apiResponse(res, 200, true, product, 'Product status updated successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }
}

module.exports = new ProductController();
