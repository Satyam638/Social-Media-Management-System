const swaggerJsdoc = require('swagger-jsdoc');
console.log(process.cwd());
const options = {

  definition: {

    openapi: '3.0.0',

    info: {

      title: 'Social Media Management API',

      version: '1.0.0',

      description:
        'API docs for social media management system',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: 'http',

          scheme: 'bearer',

          bearerFormat: 'JWT',
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: [
  './routes/*.js',
  './platforms/facebook/*.js',
  './platforms/linkedin/*.js'
]
};

module.exports = swaggerJsdoc(options);