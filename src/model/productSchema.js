import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    richDescription: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 99999,
    },
    rating: {
      type: Number,
      default: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtuals: true,
});
export default mongoose.model("Product", productSchema);
