import express from "express";
import orderController from "../controller/orderController";
require("dotenv/config");
const api = process.env.API_URL;

const router = express.Router();

const initOrderRoutes = (app) => {
  //get
  router.get("/", orderController.getlist);

  // create orders
  router.post("/", orderController.create);

  // find i
  router.get("/:id", orderController.findById);

  //update
  router.put("/:id", orderController.update);

  //delete
  router.delete("/:id", orderController.delete);

  app.use(`${api}/orders`, router);
};

export default initOrderRoutes;
