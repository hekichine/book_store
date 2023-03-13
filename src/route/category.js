import express from "express";
import categoryController from "../controller/categoryController";
import upload from "../midleware/upload";
require("dotenv/config");

const router = express.Router();
const api = process.env.API_URL;

const initCategoryRoutes = (app) => {
  //get all
  router.get("/categories", categoryController.getall);

  // create
  router.post("/categories", upload.single("image"), categoryController.create);

  //delete
  router.delete("/categories/:id", categoryController.delete);

  // find by id
  router.get("/categories/:id", categoryController.findById);
  //update category

  router.put(
    "/categories/:id",
    upload.single("image"),
    categoryController.update
  );

  app.use(api, router);
};
export default initCategoryRoutes;
