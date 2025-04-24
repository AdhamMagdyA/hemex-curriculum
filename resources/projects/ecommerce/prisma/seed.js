const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoles() {
  try {
    // Check if roles already exist
    const existingRoles = await prisma.role.findMany({
      where: {
        name: { in: ['admin', 'customer'] }
      }
    });

    const existingRoleNames = existingRoles.map(role => role.name);
    
    // Only create roles that don't exist
    const rolesToCreate = [
      { name: 'admin' },
      { name: 'customer' }
    ].filter(role => !existingRoleNames.includes(role.name));

    if (rolesToCreate.length > 0) {
      await prisma.role.createMany({
        data: rolesToCreate
      });
      console.log('Created roles:', rolesToCreate.map(r => r.name).join(', '));
    } else {
      console.log('Roles already exist - no seeding needed');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRoles();
