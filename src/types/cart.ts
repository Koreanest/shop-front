export type CartItem = {
  id: string; // productId + option
  productId: number;
  title: string;
  price: number;
  image: string;
  option: string;
  quantity: number;
};