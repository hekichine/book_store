import express from "express";
import productController from "../controller/productController";
require("dotenv/config");
import upload from "../midleware/upload";

const router = express.Router();
const api = process.env.API_URL;

const initProductRoutes = (app) => {
  router.get("/", productController.getall);

  // create product
  router.post("/", upload.single("image"), productController.create);
  //update
  router.put("/:id", productController.update);
  // update gallery
  router.put(
    "/gallery/:id",
    upload.array("images", 10),
    productController.updateGallery
  );
  // update main image
  router.put(
    "/image/:id",
    upload.single("image"),
    productController.updateimage
  );
  // delete
  router.delete("/:id", productController.delete);
  // find by id
  router.get("/:id", productController.findById);

  router.get("/get/count", productController.getCount);
  //
  router.get("/get/featured/:count", productController.getFeatured);

  app.use(`${api}/products`, router);
};
export default initProductRoutes;
