import Update from "../models/Update.js";

export const getUpdates = async (_req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    return res.json(updates);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch updates", error: error.message });
  }
};

export const createUpdate = async (req, res) => {
  try {
    const { title, content, type, mediaUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const update = await Update.create({
      title,
      content,
      type: type || "update",
      mediaUrl,
      createdBy: req.user?.name || "Sakhi Team"
    });

    return res.status(201).json(update);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create update", error: error.message });
  }
};

export const deleteUpdate = async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    return res.json({ message: "Update deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete update", error: error.message });
  }
};
