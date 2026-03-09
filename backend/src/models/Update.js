import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "", trim: true },
    type: { type: String, enum: ["update", "post", "reel"], default: "update" },
    mediaUrl: { type: String, default: "", trim: true },
    createdBy: { type: String, default: "Sakhi Team" }
  },
  { timestamps: true }
);

export default mongoose.model("Update", updateSchema);
