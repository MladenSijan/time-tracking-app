export interface Employee {
  id: string;
  name: string;
  totalClockedInTime: number;
  totalProductiveTime: number;
  totalUnproductiveTime: number;
  productivityRatio: number;
  active: boolean;
}
