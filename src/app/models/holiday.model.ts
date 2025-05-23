import { Company } from "./company.model";

export interface Holiday {
  holidayID: number;
  companyID: number;
  holidayDate: Date;
  company: Company | null;
  holidayName: string;
}