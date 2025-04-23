const jwt = require("jsonwebtoken");
const ApiError = require("../errors/ApiError");
const config = require("../config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const auth = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ApiError(401, "Authentication required");
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true },
      });
      req.user.role = user.role;
      if (requiredRole && req.user.role.name !== requiredRole) {
        throw new ApiError(403, "Insufficient permissions");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = auth;
