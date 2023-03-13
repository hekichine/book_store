import userSchema from "../model/userSchema";
import bcrypt from "bcrypt";
require("dotenv/config");

const secret = process.env.SECRET;

let userController = {
  getlist: async (req, res) => {
    let users = await userSchema.find();
    if (!users) {
      res.status(200).json({
        success: false,
      });
    }
    res.status(200).json({
      message: "Get list user",
      success: true,
      users,
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
      isAdmin: false,
    });
    console.log(user);
    await user
      .save()
      .then((user) => {
        console.log(user);
        res.status(200).json({
          message: "Create success",
          success: true,
          user: user,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({
          message: "The user can't created",
          err,
          success: false,
        });
      });
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
        res.status(200).json({
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
      res.status(200).json({
        message: "Signin success",
        success: true,
        user: {
          username: user.username,
          fullname: user.fullname,
          fullname: user.fullname,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(200).json({
        message: "Password is wrong!",
        success: false,
      });
    }
  },
  delete: async (req, res) => {
    let { id } = req.params;

    await userSchema
      .findByIdAndDelete(id)
      .then((user) => {
        if (user) {
          res.status(200).json({
            message: "Delete user success",
            success: true,
          });
        } else {
          res.status(200).json({
            message: "Delete user error",
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          message: "Error",
          success: false,
          error: err,
        });
      });
  },
};
export default userController;
