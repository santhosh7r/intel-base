export interface Company {
  id: number;
  cin: string;
  company_name: string;
  status: string;
  roc: string;
  company_type: string;
  incorporation_date: string;
  email: string;
  website: string;
  address: string;
  state: string;
  city: string;
  authorized_capital: string;
  paid_up_capital: string;
  company_category: string;
  company_subcategory: string;
  source_url: string;
  content_hash: string;
  scraped_at: string;
  updated_at: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
