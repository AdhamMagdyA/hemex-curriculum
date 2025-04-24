const ApiError = require('../errors/ApiError');
const apiResponse = require('../utils/apiResponse');
const categoryService = require('../services/categoryService');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      apiResponse(res, 200, true, categories, 'Categories retrieved successfully');
    } catch (error) {
      const status = error.statusCode || 500;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async getCategory(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      apiResponse(res, 200, true, category, 'Category retrieved successfully');
    } catch (error) {
      const status = error.statusCode || 500;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      apiResponse(res, 201, true, category, 'Category created successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      apiResponse(res, 200, true, category, 'Category updated successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      apiResponse(res, 204, true, null, 'Category deleted successfully');
    } catch (error) {
      const status = error.statusCode || 400;
      apiResponse(res, status, false, null, error.message);
    }
  }
}

module.exports = new CategoryController();
