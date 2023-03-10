import mongoose from "mongoose";
require("dotenv/config");

const db = process.env.DATABASE;

const connect = async () => {
  try {
    mongoose.connect(db);
    console.log("Connect database success");
  } catch (err) {
    console.log("Connect database failed");
  }
};
export default connect;
