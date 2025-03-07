import { db } from ".";
import { InsertProduct, productsTable } from "./schema";

const getRandomPrice = () => {
  const PRICES = [99.99, 199.99, 299.99, 399.99, 499.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};

const COLORS = ["white", "beige", "blue", "green", "purple"] as const;
const SIZES = ["S", "M", "L"] as const;
const DESCRIPTIONS = {
  white:
    "A timeless classic, this white t-shirt offers a clean and versatile look. Crafted from soft, breathable cotton, it's perfect for everyday wear, whether layered or worn on its own.",
  beige:
    "Elevate your casual wardrobe with this beige t-shirt. Its neutral tone and lightweight fabric provide a relaxed yet sophisticated feel, making it a staple for effortless styling.",
  blue: "Add a pop of cool to your outfit with this blue t-shirt. Designed for all-day comfort, its rich hue and soft texture make it ideal for both casual and smart-casual looks.",
  green:
    "Refresh your style with this vibrant green t-shirt. The perfect balance of comfort and boldness, it pairs well with jeans or joggers for a laid-back, confident vibe.",
  purple:
    "Stand out in this stylish purple t-shirt. Its deep, rich color and ultra-soft fabric make it a go-to choice for those who love a blend of elegance and comfort.",
};

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
          description: DESCRIPTIONS[color],
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
