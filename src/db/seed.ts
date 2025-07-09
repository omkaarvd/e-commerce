import { db } from ".";
import { InsertProduct, productsTable } from "./schema";

const getRandomPrice = () => {
  const PRICES = [99.99, 199.99, 299.99, 399.99, 499.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};

const getRandomBet1to10 = () => Math.floor(Math.random() * 10);

const seedTshirts = async () => {
  const products: InsertProduct[] = [];

  const SIZES = ["S", "M", "L"] as const;
  const COLORS = ["white", "beige", "blue", "green", "purple"] as const;
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

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < COLORS.length; j++) {
      for (let k = 0; k < SIZES.length; k++) {
        const size = SIZES[k];
        const color = COLORS[j];
        const price = getRandomPrice();
        const name = `${
          color.slice(0, 1).toUpperCase() + color.slice(1)
        } shirt ${i}`;

        products.push({
          id: `${color}-${size}-${i + 1}`,
          imageURL: `/media/tshirts/${color}_${i + 1}.png`,
          color,
          name,
          size,
          price,
          description: DESCRIPTIONS[color],
          available: getRandomBet1to10(),
        });
      }
    }
  }

  try {
    await db.insert(productsTable).values(products);
  } catch (error) {
    console.error("Error seeding t-shirts in the database:", error);
  }
};

seedTshirts();

async function seedJackets() {
  const products: InsertProduct[] = [
    {
      id: "dark_down_jacket_1",
      name: "Dark Down Jacket 1",
      imageURL: "/media/jackets/dark_down_jacket_1.png",
      color: "black",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A sleek, insulated down jacket designed for chilly urban adventures. Its slim fit and dark hue make it a versatile addition to any winter wardrobe.",
    },
    {
      id: "dark_down_jacket_2",
      name: "Dark Down Jacket 2",
      imageURL: "/media/jackets/dark_down_jacket_2.png",
      color: "black",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "This durable down jacket offers exceptional warmth with a touch of elegance. Perfect for those who demand both style and functionality in cold weather.",
    },
    {
      id: "dark_fleece_jacket_1",
      name: "Dark Fleece Jacket 1",
      imageURL: "/media/jackets/dark_fleece_jacket_1.png",
      color: "beige",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Experience the cozy warmth of this dark fleece jacket. Ideal for layering, its soft texture and classic design ensure comfort and style on cooler days.",
    },
    {
      id: "dark_leather_jacket_1",
      name: "Dark Leather Jacket 1",
      imageURL: "/media/jackets/dark_leather_jacket_1.png",
      color: "black",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A timeless dark leather jacket that combines classic styling with rugged durability. Perfect for adding an edge to any outfit, rain or shine.",
    },
    {
      id: "dark_parka_jacket_1",
      name: "Dark Parka Jacket 1",
      imageURL: "/media/jackets/dark_parka_jacket_1.png",
      color: "beige",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Stay protected against the elements with this durable parka. Its insulated lining and fur-trimmed hood offer warmth and style in harsh conditions.",
    },
    {
      id: "dark_parka_jacket_2",
      name: "Dark Parka Jacket 2",
      imageURL: "/media/jackets/dark_parka_jacket_2.png",
      color: "beige",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "This sleek parka features a waterproof exterior and a thermal interior, making it a must-have for winter escapades in the city or the mountains.",
    },
    {
      id: "dark_parka_jacket_3",
      name: "Dark Parka Jacket 3",
      imageURL: "/media/jackets/dark_parka_jacket_3.png",
      color: "beige",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "With its adjustable features and multiple pockets, this parka blends practicality with modern aesthetics for the ultimate winter outerwear.",
    },
    {
      id: "dark_trench_coat_1",
      name: "Dark Trench Coat 1",
      imageURL: "/media/jackets/dark_trench_coat_1.png",
      color: "black",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A modern twist on a classic design, this dark trench coat offers both sophistication and weather resistance, perfect for rainy days.",
    },
    {
      id: "light_down_jacket_1",
      name: "Light Down Jacket 1",
      imageURL: "/media/jackets/light_down_jacket_1.png",
      color: "beige",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.",
    },
    {
      id: "light_down_jacket_2",
      name: "Light Down Jacket 2",
      imageURL: "/media/jackets/light_down_jacket_2.png",
      color: "white",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Embrace the cold in this light and airy down jacket, featuring a water-resistant shell and a sleek design for everyday wear.",
    },
    {
      id: "light_down_jacket_3",
      name: "Light Down Jacket 3",
      imageURL: "/media/jackets/light_down_jacket_3.png",
      color: "white",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "This stylish down jacket combines warmth and lightweight design, making it the perfect companion for winter travel.",
    },
    {
      id: "light_fleece_jacket_1",
      name: "Light Fleece Jacket 1",
      imageURL: "/media/jackets/light_fleece_jacket_1.png",
      color: "beige",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Enjoy the soft touch of this light fleece jacket, designed for brisk mornings and cool evenings, with a versatile zip-up style for easy layering.",
    },
    {
      id: "light_jeans_jacket_1",
      name: "Light Jeans Jacket 1",
      imageURL: "/media/jackets/light_jeans_jacket_1.png",
      color: "blue",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A casual classic, this light denim jacket adds a layer of cool to any outfit, perfect for those crisp, sunny days.",
    },
    {
      id: "light_jeans_jacket_2",
      name: "Light Jeans Jacket 2",
      imageURL: "/media/jackets/light_jeans_jacket_2.png",
      color: "blue",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Upgrade your casual wear with this distressed light denim jacket, featuring a relaxed fit and timeless appeal.",
    },
    {
      id: "light_parka_jacket_1",
      name: "Light Parka Jacket 1",
      imageURL: "/media/jackets/light_parka_jacket_1.png",
      color: "beige",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "This light parka offers a breathable, water-resistant layer, ideal for unpredictable weather, with a sleek design that doesn't compromise on style.",
    },
    {
      id: "light_trench_coat_1",
      name: "Light Trench Coat 1",
      imageURL: "/media/jackets/light_trench_coat_1.png",
      color: "beige",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A chic and lightweight trench coat that brings an elegant layer to spring and autumn outfits, with a belted waist for a flattering fit.",
    },
    {
      id: "light_trench_coat_2",
      name: "Light Trench Coat 2",
      imageURL: "/media/jackets/light_trench_coat_2.png",
      color: "beige",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Enjoy a stylish and sophisticated look with this lightweight trench coat made from a fabric that resists both wind and rain. Perfect for the transition between seasons.",
    },
    {
      id: "light_wind_jacket_1",
      name: "Light Wind Jacket 1",
      imageURL: "/media/jackets/light_wind_jacket_1.png",
      color: "green",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Take on the breezy days with this lightweight wind jacket that is designed to offer protection and style with its minimalist design and functional features.",
    },
    {
      id: "light_wind_jacket_2",
      name: "Light Wind Jacket 2",
      imageURL: "/media/jackets/light_wind_jacket_2.png",
      color: "green",
      size: "S",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A versatile windbreaker for active days. This jacket offers lightweight comfort and resistance to the elements in a sleek package.",
    },
    {
      id: "light_wind_jacket_3",
      name: "Light Wind Jacket 3",
      imageURL: "/media/jackets/light_wind_jacket_3.png",
      color: "green",
      size: "M",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "Stay ahead of the weather with this dynamic light wind jacket, combining breathability with waterproof technology for all-day comfort.",
    },
    {
      id: "light_wind_jacket_4",
      name: "Light Wind Jacket 4",
      imageURL: "/media/jackets/light_wind_jacket_4.png",
      color: "green",
      size: "L",
      price: getRandomPrice(),
      available: getRandomBet1to10(),
      description:
        "A comfortable wind jacket designed to keep you warm during winter or rain. With a minimal light grey color it suits the rest of your outfit well.",
    },
  ];

  try {
    await db.insert(productsTable).values(products);
  } catch (error) {
    console.error("Error seeding jackets in the database:", error);
  }
}

seedJackets();
