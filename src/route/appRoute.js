import productController from "../controller/productController";

const express = require("express");

const route = express.Router();
require("dotenv/config");

const api = process.env.API_URL;

const initRouter = (app) => {
  route.get("/", (req, res) => {
    res.status(200).json({
      message: 123,
    });
  });
  //add product
  route.post("/product", productController.create);
  app.use(api, route);
};
export default initRouter;
