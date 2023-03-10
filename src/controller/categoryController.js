import categorySchema from "../model/categorySchema";

const categoryController = {
  getall: async (req, res) => {
    await categorySchema
      .find()
      .then((result) => {
        res.status(200).json({
          message: "Get all category",
          success: true,
          category: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Get failed",
          success: false,
          err,
        });
      });
  },
  create: async (req, res) => {
    let category = new categorySchema({
      name: req.body?.name,
    });
    let findCate = await categorySchema.find({ name: req.body?.name });
    if (findCate.length > 0) {
      return res.status(200).json({
        message: "The category is exist",
        success: false,
      });
    }
    await category
      .save()
      .then((category) =>
        res.status(200).json({
          message: "Create success",
          success: true,
          category: category,
        })
      )
      .catch((err) =>
        res.status(500).json({
          message: "The category can't created",
          err,
          success: false,
        })
      );
  },
  delete: async (req, res) => {
    let { id } = req.params;
    await categorySchema
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
        res.status(500).json({
          message: "Error query",
          success: false,
          err,
        });
      });
  },
  findById: async (req, res) => {
    let { id } = req.params;
    await categorySchema
      .findById(id)
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: `Find category id: ${id}`,
            success: true,
            category: result,
          });
        } else {
          res.status(200).json({
            message: "Not found",
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error",
          success: false,
        });
      });
  },
  update: async (req, res) => {
    let { id } = req.params;
    let category = req.body;
    await categorySchema
      .findByIdAndUpdate(category?.id || id, category, { new: true })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Update success",
            category: result,
            success: true,
          });
        } else {
          res.status(404).json({
            message: "Id not found",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          err,
        });
      });
  },
};
export default categoryController;
