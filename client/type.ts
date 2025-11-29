type Product = {
  category?: string;
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  prepTime?: string | null;
  ingredients?: string[] | null;
};
export type { Product };