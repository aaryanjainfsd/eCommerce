import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eComForAll Backend API",
      version: "1.0.0",
      description: "API docs for storefront, admin, super admin and shared modules"
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Local server"
      }
    ]
  },
  apis: [
    "./index.js",
    "./src/storeFront/routes/*.js",
    "./src/adminPanel/routes/*.js",
    "./src/superAdminPanel/routes/*.js",
    "./src/shared/routes/*.js"
  ]
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;