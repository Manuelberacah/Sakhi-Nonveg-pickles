import Product from "../models/Product.js";
import { defaultProducts } from "../data/products.js";

export const seedProducts = async () => {
  let inserted = 0;

  for (const product of defaultProducts) {
    const exists = await Product.findOne({ slug: product.slug });
    if (!exists) {
      await Product.create(product);
      inserted += 1;
    }
  }

  if (inserted > 0) {
    console.log(`Seeded ${inserted} default product(s)`);
  } else {
    console.log("Default products already present; skipped seeding");
  }
};
