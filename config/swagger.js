const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Voting System API',
            version: '1.0.0',
            description: 'API documentation for the Voting System Backend',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
            {
                url: 'https://votingsystembackend.onrender.com',
                description: 'Production server',
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
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
