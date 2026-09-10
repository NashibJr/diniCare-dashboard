export type GeneralQuery<T> = {
  page: number;
  pages: number;
  total: number;
  data: T[];
};

export type GeneralCreate<T> = {
  data?: T;
  message?: string;
  error?: string;
};

export type Address = {
  label: string;
  street?: string;
  zipCode?: string;
  city: string;
  _id?: string;
};

export type Account = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  phone: string;
  addresses: Address[];
  status: string;
  accType: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

export type LoginResponse = {
  data?: Account;
  token?: string;
  message?: string;
  error?: string;
};

export type Category = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Product = {
  _id: string;
  name: string;
  images: string[];
  category: Category;
  price: number;
  status: string;
  sku: string;
  description: string;
  stock: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

// Order item with populated product
export type OrderItem = {
  item: Product;
  quantity: number;
};

export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
  password?: string; // Optional as it might not always be returned
  phone: string;
  addresses: Address[];
  status: string;
  accType: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

// Shipping address
export type ShippingAddress = {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
};

// Order with populated items
export type Order = {
  _id: string;
  orderId: string;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  totalAmount: number;
  customer: Customer;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

// For creating a new order
export type CreateOrderInput = {
  orderId: string;
  customer: string;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  totalAmount?: number;
  status?: string;
  items: Array<{
    item: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
};

export type OrderResponse = {
  data: Order;
  message?: string;
  statusCode?: number;
};

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  password: string;
  phone: string;
  addresses: Address[];
  status: string;
  accType: string;
  createdAt: string;
  updatedAt: string;
}

export type DeleteUpdateResponse = {
  deleteCount?: number;
  matchedCount?: number;
  message?: string;
  error?: string;
};
