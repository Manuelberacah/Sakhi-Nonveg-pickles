import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    size: { type: String, enum: ["250g", "500g", "1kg"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, min: 1, required: true },
    subtotal: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    region: {
      type: String,
      enum: ["andhra-pradesh", "south-india", "rest-of-india"],
      required: true
    },
    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "placed" },
    paymentProvider: { type: String, default: "razorpay" },
    paymentOrderId: { type: String },
    paymentId: { type: String },
    paymentSignature: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
