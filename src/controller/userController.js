import userSchema from "../model/userSchema";
import bcrypt from "bcrypt";
require("dotenv/config");
import jwt from "jsonwebtoken";

const secret = process.env.SECRET;

let userController = {
  getlist: async (req, res) => {
    let result = await userSchema.find();
    if (!result) {
      res.status(500).json({
        success: false,
      });
    }
    res.status(200).json({
      message: "Get list user",
      success: true,
      result,
    });
  },
  create: async (req, res) => {
    let username = req.body?.username;
    let email = req.body?.email;

    let findUser = await userSchema.find({ username: username });
    let findEmail = await userSchema.find({ email: email });
    if (findUser.length > 0) {
      return res.status(200).json({
        message: "Username is exists",
        success: false,
      });
    }
    if (findEmail.length > 0) {
      return res.status(200).json({
        message: "Email is exists",
        success: false,
      });
    }
    let user = new userSchema({
      username: req.body?.username,
      email: req.body?.email,
      password: bcrypt.hashSync(req.body?.password, 10),
      fullname: req.body?.fullname,
      address: req.body?.address,
      phone: req.body?.phone,
      isAdmin: req.body?.isAdmin,
    });
    await user
      .save()
      .then((user) =>
        res.status(200).json({
          message: "Create success",
          success: true,
          user: user,
        })
      )
      .catch((err) =>
        res.status(500).json({
          message: "The user can't created",
          err,
          success: false,
        })
      );
  },
  findById: async (req, res) => {
    let { id } = req.params;
    await userSchema
      .findById(id)
      .select("-password")
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: `Find user id: ${id}`,
            success: true,
            user: result,
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
  signin: async (req, res) => {
    let user = await userSchema.findOne({ username: req.body?.username });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    }
    if (user && bcrypt.compareSync(req.body?.password, user.password)) {
      const token = jwt.sign(
        {
          userId: user.id,
        },
        secret,
        {
          expiresIn: "365d",
        }
      );
      res.status(200).json({
        message: "Signin success",
        success: true,
        user: {
          username: user.username,
          fullname: user.fullname,
          token: token,
        },
      });
    } else {
      res.status(200).json({
        message: "Password is wrong!",
        success: false,
      });
    }
  },
};
export default userController;
