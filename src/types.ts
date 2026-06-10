export interface Product {
  id: string; // unique identifier
  title: string;
  brand: string;
  price: number;
  description: string;
  sizes: string[]; // parsed from comma-separated string
  image_url: string;
  category: string; // e.g. Casual, Formal, Sport
}

export interface Order {
  timestamp: string; // ISO date string or formatted date
  name: string;
  email: string;
  phone: string;
  address: string;
  shoe_id: string; // references Product.id
  shoe_title?: string; // transient/resolved title
  shoe_price?: number; // transient/resolved price
  size: string; // chosen size (e.g. "9")
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
}

export interface AdminAuth {
  username: string;
  password_hash: string;
}

export type ViewState = 'landing' | 'catalogue' | 'admin';
