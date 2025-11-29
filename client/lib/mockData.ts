import { Product } from "@/type";

export const getProducts = async (): Promise<Product[]> => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: 1,
      name: "Hamburguesa Clásica",
      description:
        "Carne de res, queso cheddar, lechuga, tomate y salsa especial.",
      price: 10, // El valor que ya tenías
      image: null, // El valor que ya tenías

      // --- AGREGA ESTAS LÍNEAS ---
      category: "Hamburguesas", // O el string que corresponda
      prepTime: "15", // O "15 min" dependiendo de cómo definiste el tipo
      ingredients: ["Carne", "Queso", "Pan"], // O un array vacío []
    },
    {
      id: 2,
      name: "Tequeños (12 und)",
      description:
 "Deditos de queso envueltos en masa crujiente, acompañados de salsa tártara.",
      price: 4.5,
      image: null,
      category: "Entradas",
      prepTime: "10",
      ingredients: ["Harina", "Queso", "Aceite"],
    },
    {
      id: 3,
      name: "Sushi Roll Tropical",
      description: "Salmón, queso crema, aguacate y topping de mango.",
      price: 8.99,
      image: null,
      category: "Sushi",
      prepTime: "20",
      ingredients: ["Salmón", "Queso Crema", "Aguacate", "Arroz"],
    },
    {
      id: 4,
      name: "Refresco 1.5L",
      description: "Coca-Cola, Pepsi o Chinotto.",
      price: 2.0,
      image: null,
      category: "Bebidas",
      prepTime: "1",
      ingredients: ["Agua carbonatada", "Azúcar", "Saborizantes"],
    },
    {
      id: 5,
      name: "Salsa de Ajo",
      description: "Nuestra famosa salsa de ajo de la casa.",
      price: 0.5,
      image: null,
      category: "Salsas",
      prepTime:"5",
      ingredients: ["Ajo", "Mayonesa", "Perejil"],
    },
  ];
};
