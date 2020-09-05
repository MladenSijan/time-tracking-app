export interface Employee {
  id: number;
  name: string;
  totalClockedInTime: number;
  totalProductiveTime: number;
  totalUnproductiveTime: number;
  productivityRatio: number;
  active: boolean;
}
