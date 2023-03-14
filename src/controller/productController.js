import productSchema from "../model/productSchema";
import categorySchema from "../model/categorySchema";
import mongoose from "mongoose";

const productController = {
  create: async (req, res) => {
    let cate = await categorySchema.findById({ _id: req.body?.category });
    if (!cate)
      return res
        .status(200)
        .json({ message: "ID category invalid", success: false });
    let name = await productSchema.findOne({ name: req.body?.name });
    if (name) {
      return res
        .status(200)
        .json({ message: "Product is ready exists", success: false });
    }
    let file = req.file;
    if (!file) {
      return res.status(200).json({
        message: "No images",
        success: false,
      });
    }
    const fileName = req.file?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    const product = new productSchema({
      name: req.body?.name,
      description: req.body?.description,
      image: `${basePath}${fileName}`,
      price: req.body?.price,
      sale: req.body?.sale,
      category: req.body?.category,
      countInStock: req.body?.countInStock,
      author: req.body?.author,
      isFeatured: req.body?.isFeatured,
    });

    await product
      .save()
      .then((createProduct) => {
        res.status(200).json({
          message: "Add product success",
          success: true,
          product: createProduct,
        });
      })
      .catch((err) => {
        res.status(200).json({
          error: err,
          message: "Error",
          success: false,
        });
      });

    // console.log(prodt);
  },
  getall: async (req, res) => {
    //query api/v1/products?category=xassada
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    await productSchema
      .find(filter)
      .populate("category")
      .then((list_products) => {
        res.status(200).json({
          message: "Get all products",
          success: true,
          products: list_products,
        });
      })
      .catch((err) => {
        res.status(200).json({
          message: "Not found",
          success: false,
          err,
        });
      });
  },
  update: async (req, res) => {
    let { id } = req.params;
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(200)
          .json({ message: "Invalid product id", success: false });
      }
      if (req.body?.category) {
        let cate = await categorySchema.findById({ _id: req.body?.category });
        if (!cate)
          return res
            .status(200)
            .json({ message: "ID category invalid", success: false });
      }

      const product = await productSchema.findByIdAndUpdate(
        id,
        {
          name: req.body?.name,
          description: req.body?.description,
          price: req.body?.price,
          sale: req.body?.sale,
          category: req.body?.category,
          author: req.body?.author,
          countInStock: req.body?.countInStock,
          isFeatured: req.body?.isFeatured,
        },
        { new: true }
      );
      if (!product) {
        return res.status(200).json({
          message: "The product cannot updated",
          success: false,
        });
      }
      res.status(200).json({
        message: "Product update success",
        success: true,
        product: product,
      });
    } catch (error) {
      return res.status(200).json({
        error,
        success: false,
      });
    }
  },
  delete: async (req, res) => {
    let { id } = req.params;
    productSchema
      .findByIdAndDelete(id)
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Delete success",
            success: true,
          });
        } else {
          res.status(404).json({
            message: "ID not found",
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          message: "Error query",
          success: false,
          err,
        });
      });
  },
  findById: async (req, res) => {
    let { id } = req.params;
    await productSchema
      .findById(id)
      .populate("category")
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: `Find product id: ${id}`,
            success: true,
            product: result,
          });
        } else {
          res.status(200).json({
            message: "Not found",
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          message: "Error",
          success: false,
        });
      });
  },
  getCount: async (req, res) => {
    let productCount = await productSchema.countDocuments();

    if (!productController) {
      res.status(200).json({
        success: false,
      });
    }
    res.status(200).json({
      productCount: productCount,
    });
  },
  getFeatured: async (req, res) => {
    let count = req.params?.count ? req.params.count : 0;

    let products = await productSchema.find({ isFeatured: true }).limit(+count);

    if (!products) {
      res.status(200).json({
        success: false,
      });
    }
    res.status(200).json({
      products: products,
    });
  },
  updateGallery: async (req, res) => {
    let { id } = req.params;
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(200)
          .json({ message: "Invalid product id", success: false });
      }
      const files = req.files;
      if (files?.length === 0) {
        return res.status(200).json({
          message: "No gallery",
          success: false,
        });
      }
      const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
      let imagesPaths = [];
      if (files) {
        files.map((file) => {
          imagesPaths.push(`${basePath}${file?.filename}`);
        });
      }
      const product = await productSchema.findByIdAndUpdate(
        id,
        {
          images: imagesPaths,
        },
        { new: true }
      );
      console.log(imagesPaths);
      if (!product) {
        return res.status(200).json({
          message: "The gallery cannot updated",
          success: false,
        });
      }
      res.status(200).json({
        message: "Gallery update success",
        success: true,
        product: product,
      });
    } catch (error) {
      return res.status(200).json({
        error,
      });
    }
  },
  updateimage: async (req, res) => {
    let { id } = req.params;
    try {
      if (!mongoose.isValidObjectId(id)) {
        return res
          .status(200)
          .json({ message: "Invalid product id", success: false });
      }
      const file = req.file;

      const basePath = `${req.protocol}://${req.get("host")}/uploads/`;

      const product = await productSchema.findByIdAndUpdate(
        id,
        {
          image: `${basePath}${file?.filename}`,
        },
        { new: true }
      );
      if (!product) {
        return res.status(200).json({
          message: "The gallery cannot updated",
          success: false,
        });
      }
      res.status(200).json({
        message: "Gallery update success",
        success: true,
        product: product,
      });
    } catch (error) {
      return res.status(200).json({
        error,
      });
    }
  },
};
export default productController;
