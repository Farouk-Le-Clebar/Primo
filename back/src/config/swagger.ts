import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    info: {
      title: "Prototype Primo",
      version: "1.0.0",},
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger available at http://localhost:3000/doc");
};