const app = require('../src/app');
const listEndpoints = require('express-list-endpoints');

const endpoints = listEndpoints(app);

console.log('\nAPI Endpoints:');
console.log('=============');

endpoints.forEach(endpoint => {
  console.log(`${endpoint.methods.join(', ').padEnd(10)} ${endpoint.path}`);
});

console.log(`\nTotal endpoints: ${endpoints.length}`);
