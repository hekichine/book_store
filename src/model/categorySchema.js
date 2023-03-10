import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamp: true,
  }
);
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", {
  virtuals: true,
});
export default mongoose.model("Category", categorySchema);
