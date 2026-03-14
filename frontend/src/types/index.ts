export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  sellerId: string;
  seller: { id: string; name: string };
  auction?: Auction;
  createdAt: string;
}

export interface Auction {
  id: string;
  startPrice: number;
  currentPrice: number;
  bidIncrement: number;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  productId: string;
  product: Product;
  winnerId?: string;
  winner?: { id: string; name: string };
  bids?: Bid[];
  _count?: { bids: number };
  createdAt: string;
}

export interface Bid {
  id: string;
  amount: number;
  auctionId: string;
  bidderId: string;
  bidder: { id: string; name: string };
  auction?: Auction;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalAuctions: number;
    totalBids: number;
    activeAuctions: number;
  };
  recentBids: Bid[];
}
