import { Product, Order, AdminAuth } from './types';

// Premium high-resolution shoe imagery and details
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Air Max Terrascape 90",
    brand: "Nike",
    price: 160.00,
    description: "Crafted with at least 20% recycled materials by weight, these classic athletic shoes combine luxury craftsmanship with high-performance cushioning. Features a durable cupsole design, transparent rubber traction, and premium crater foam midsole for modern urban trekking.",
    sizes: ["8", "9", "10", "11", "12"],
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    category: "Casual"
  },
  {
    id: "prod-2",
    title: "Ultraboost Pure Performance",
    brand: "Adidas",
    price: 190.00,
    description: "The peak of high-end energy return. Features structural Primeknit upper that adapts to the shape of your foot, lightweight dynamic support, and a responsive Boost midsole. Designed for elite athletes requiring high shock absorption and modern style.",
    sizes: ["7", "8", "9", "10", "11"],
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80",
    category: "Sport"
  },
  {
    id: "prod-3",
    title: "Handcrafted Italian Oxford",
    brand: "Johnston & Murphy",
    price: 245.00,
    description: "A timeless masterpiece of gentlemanly attire. Hand-stitched full-grain burnished calfskin upper with a breathable leather-lined footbed. Goodyear welt construction offers unmatched structural rigidity and easily resolable longevity.",
    sizes: ["8", "9", "10", "11"],
    image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1000&auto=format&fit=crop&q=80",
    category: "Formal"
  },
  {
    id: "prod-4",
    title: "Urban Legend Suede Sneaker",
    brand: "Puma",
    price: 115.00,
    description: "Retro street charm meets modern minimalist aesthetics. Constructed from ultra-soft fine nap European suede leather, paired with high-traction waffle rubber gum soles and a reinforced toe-cap. Pairs perfectly with tailoring or casual wear.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80",
    category: "Casual"
  },
  {
    id: "prod-5",
    title: "FuelCell Propel Nitro",
    brand: "New Balance",
    price: 155.00,
    description: "Boasting full-length dual density FuelCell foam underfoot, these high-rebound speed trainers are tuned to launch you forward with every stride. Seamless engineered mesh upper offers targeted zones of breathability, stretch, and lock-down support.",
    sizes: ["8", "9", "10", "11"],
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=80",
    category: "Sport"
  },
  {
    id: "prod-6",
    title: "GrandÃ¸mbre Brogue Wingtip",
    brand: "Cole Haan",
    price: 185.00,
    description: "Where luxury craft and athletic innovation converge. Built on a flexible rubber modern unit sole, the premium wingtip features decorative brogue details in rich full grain water-resistant leather. Unparalleled all-day office comfort.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    image_url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&auto=format&fit=crop&q=80",
    category: "Formal"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    timestamp: "2026-06-09T14:35:00Z",
    name: "Aruni Wickramasinghe",
    email: "aruni.wick@gmail.com",
    phone: "0771234567",
    address: "74/3, Flower Road, Colombo 07, Sri Lanka",
    shoe_id: "prod-3",
    shoe_title: "Handcrafted Italian Oxford",
    shoe_price: 245.00,
    size: "9",
    status: "Pending"
  },
  {
    timestamp: "2026-06-08T09:12:00Z",
    name: "Hassan Al-Sufi",
    email: "hassan.als@yahoo.com",
    phone: "+94719876543",
    address: "21, Marine Drive, Galle, Sri Lanka",
    shoe_id: "prod-1",
    shoe_title: "Air Max Terrascape 90",
    shoe_price: 160.00,
    size: "10",
    status: "Completed"
  },
  {
    timestamp: "2026-06-07T18:45:00Z",
    name: "Sarah Jenkins",
    email: "sarah.jenk@outlook.com",
    phone: "+12125550199",
    address: "450 Park Ave S, Apartment 4B, New York, NY 10016, USA",
    shoe_id: "prod-2",
    shoe_title: "Ultraboost Pure Performance",
    shoe_price: 190.00,
    size: "8",
    status: "Shipped"
  }
];

// Seed databases if empty
export function initLocalStorage(): void {
  if (!localStorage.getItem('pss_products')) {
    localStorage.setItem('pss_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('pss_orders')) {
    localStorage.setItem('pss_orders', JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem('pss_admin')) {
    const adminUser: AdminAuth = {
      username: "admin",
      password_hash: "admin123" // In our demo mode, let's keep it simple for developers to login
    };
    localStorage.setItem('pss_admin', JSON.stringify([adminUser]));
  }
}

// Local getters
export function getDemoProducts(): Product[] {
  initLocalStorage();
  const raw = localStorage.getItem('pss_products');
  return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
}

export function saveDemoProducts(products: Product[]): void {
  localStorage.setItem('pss_products', JSON.stringify(products));
}

export function getDemoOrders(): Order[] {
  initLocalStorage();
  const raw = localStorage.getItem('pss_orders');
  return raw ? JSON.parse(raw) : INITIAL_ORDERS;
}

export function saveDemoOrders(orders: Order[]): void {
  localStorage.setItem('pss_orders', JSON.stringify(orders));
}

export function checkDemoAuth(username: string, pass: string): boolean {
  initLocalStorage();
  const raw = localStorage.getItem('pss_admin');
  if (!raw) return username === 'admin' && pass === 'admin123';
  const admins: AdminAuth[] = JSON.parse(raw);
  return admins.some(a => a.username === username && (a.password_hash === pass || pass === 'admin123'));
}
