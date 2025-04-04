export interface SalesData {
  date: string;
  total_amount: number;
  service_sales: {
    service_name: string;
    amount: number;
  }[];
  payment_methods: {
    method: string;
    amount: number;
  }[];
}

export interface SalesSummary {
  total_sales: number;
  average_sales: number;
  service_sales: {
    service_name: string;
    amount: number;
  }[];
  payment_methods: {
    method: string;
    amount: number;
  }[];
}
