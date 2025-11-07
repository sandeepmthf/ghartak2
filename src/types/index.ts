export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  tags: string[];
  deliveryTime: string;
  minOrder: number;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  vendorId: string;
}

export interface Order {
  id: string;
  vendorId: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  status: string;
  createdAt: Date;
}
