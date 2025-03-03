export interface Donation {
  _id: string;
  amount: number;
  currency: string;
  donationType: string;
  status: string;
  receiptUrl: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    cnic: any;
  };
  createdAt: string;
  updatedAt: string;
  v?: number;
} 