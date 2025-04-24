const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductService {
  async getAllProducts(query = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      categoryId,
      searchTerm
    } = query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const where = { isActive: true };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    if (categoryId !== undefined) {
      where.categoryId = parseInt(categoryId);
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } }
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const nextPage = hasNextPage ? parsedPage + 1 : null;
    const hasPreviousPage = parsedPage > 1;
    const previousPage = hasPreviousPage ? parsedPage - 1 : null;

    return {
      data: products,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage
      }
    };
  }

  async getAllProductsForAdmin(query = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      categoryId,
      searchTerm
    } = query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const where = {};
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    if (categoryId !== undefined) {
      where.categoryId = parseInt(categoryId);
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } }
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const nextPage = hasNextPage ? parsedPage + 1 : null;
    const hasPreviousPage = parsedPage > 1;
    const previousPage = hasPreviousPage ? parsedPage - 1 : null;

    return {
      data: products,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage
      }
    };
  }

  async getProductById(id) {
    return prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });
  }

  async createProduct(data) {
    return prisma.product.create({ data });
  }

  async updateProduct(id, data) {
    return prisma.product.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async deleteProduct(id) {
    return prisma.product.delete({
      where: { id: parseInt(id) }
    });
  }

  async getProductsByCategory(categoryId) {
    return prisma.product.findMany({
      where: { 
        categoryId: parseInt(categoryId),
        isActive: true 
      },
      include: { category: true }
    });
  }

  async toggleProductActiveStatus(id, isActive) {
    return prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
  }
}

module.exports = new ProductService();
