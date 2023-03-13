import orderItemSchema from "../model/orderItemSchema";
import orderSchema from "../model/orderSchema";

const orderController = {
  getlist: async (req, res) => {
    const orderList = await orderSchema
      .find()
      .populate("user", "fullname")
      .populate({
        path: "orderItems",
        populate: "product",
      })
      .sort("createdAt");

    if (!orderList) {
      res.status(500).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      orderList: orderList,
    });
  },
  create: async (req, res) => {
    const orderItemIds = Promise.all(
      req.body?.orderItems.map(async (orderitem) => {
        let newOrderItem = new orderItemSchema({
          quantity: orderitem.quantity,
          product: orderitem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemIdsResolved = await orderItemIds;

    let order = new orderSchema({
      orderItems: orderItemIdsResolved,
      shippingAddress: req.body?.shippingAddress,
      phone: req.body?.phone,
      totalPrice: req.body?.totalPrice,
      user: req.body?.user,
    });

    order = await order.save();
    if (!order) {
      return res.status(500).json({ message: "Error", success: false });
    }
    res.status(200).json({
      message: "Success",
      success: true,
      order,
    });
  },
  findById: async (req, res) => {
    const order = await orderSchema
      .findById(req.params?.id)
      .populate("user", "fullname")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return res.status(200).json({ message: "Not found", success: false });
    }
    res.status(200).json({
      order,
    });
  },
  update: async (req, res) => {
    let { id } = req.params;
    let order = req.body;
    await orderSchema
      .findByIdAndUpdate(order?.id || id, order, { new: true })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: "Update success",
            order: result,
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
  delete: async (req, res) => {
    let { id } = req.params;
    await orderSchema
      .findByIdAndDelete(id)
      .then(async (result) => {
        if (result) {
          await result.orderItems.map(async (orderItem) => {
            await orderItemSchema.findByIdAndDelete(orderItem);
          });
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
};

export default orderController;

/* data order

  "orderItems":[
    { 
      quantity:3,
      "product": "6408608a78f1d758b6d224c9"
    },
    {
      "quantity":5,
      "product":"6408621962dd4cd9b76dd187"
    }
  ],
  "shippingAddress":"thai nguyen",
  "phone":"0125874",
  "totalPrice":9999,
  "user":"640a88471447ad112a82838c"


*/
