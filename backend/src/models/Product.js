import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    prices: {
      "250g": { type: Number, required: true },
      "500g": { type: Number, required: true },
      "1kg": { type: Number, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
