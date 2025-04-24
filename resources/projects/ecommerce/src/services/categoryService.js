const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany();
  }

  async getCategoryById(id) {
    return prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { products: true }
    });
  }

  async createCategory(data) {
    return prisma.category.create({ data });
  }

  async updateCategory(id, data) {
    return prisma.category.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async deleteCategory(id) {
    return prisma.category.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new CategoryService();
