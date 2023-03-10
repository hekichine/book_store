import express from "express";
import userController from "../controller/userController";
require("dotenv/config");

const router = express.Router();
const api = process.env.API_URL;

const initUserRoutes = (app) => {
  // get list
  router.get("/", userController.getlist);

  // create
  router.post("/", userController.create);

  // find by id
  router.get("/:id", userController.findById);
  // sign in
  router.post("/signin", userController.signin);

  app.use(`${api}/users`, router);
};
export default initUserRoutes;
