import { db } from ".";
import { InsertProduct, productsTable } from "./schema";

const getRandomPrice = () => {
  const PRICES = [99.99, 199.99, 299.99, 399.99, 499.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};

const COLORS = ["white", "beige", "blue", "green", "purple"] as const;
const SIZES = ["S", "M", "L"] as const;

const seed = async () => {
  const products: InsertProduct[] = [];

  // 3 example products
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < COLORS.length; j++) {
      for (let k = 0; k < SIZES.length; k++) {
        const size = SIZES[k];
        const color = COLORS[j];
        products.push({
          id: `${color}-${size}-${i + 1}`,
          imageURL: `/uploads/${color}_${i + 1}.png`,
          color,
          name: `${
            color.slice(0, 1).toUpperCase() + color.slice(1)
          } shirt ${i}`,
          size,
          price: getRandomPrice(),
        });
      }
    }
  }

  try {
    await db.insert(productsTable).values(products);

    console.log("Successfully seeded the database!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

seed();
