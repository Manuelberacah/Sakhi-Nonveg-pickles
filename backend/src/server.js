import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedProducts } from "./services/seedService.js";

dotenv.config();

const start = async () => {
  await connectDB();
  await seedProducts();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
