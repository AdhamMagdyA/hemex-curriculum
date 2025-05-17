const { port } = require('../../ecommerce/src/config');
const app = require('./app');
const prisma = require('./utils/prisma');
const PORT = port || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close();
});