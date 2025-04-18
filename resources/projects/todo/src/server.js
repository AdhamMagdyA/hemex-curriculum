const app = require('./app');
const prisma = require('./utils/prisma');
const PORT = process.env.PORT || 3000;

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