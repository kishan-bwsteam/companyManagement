import { Company } from "./company.model";

export default interface User {
    userID: number,
    userTypeId: number,
    userName: string,
    emailID: string,
    firstName: string,
    lastName: string,
    middleName: string,
    isActive: boolean
}

export interface EmployeeModel extends EmployeeDetail{

    userBasic: UserBasic;
    userPassKey?: UserPassKey;
    userAddress: UserAddress[];
    userEducation: UserEducation[];
    userBankDetail: UserBankDetail;
}
export interface AdminUser{
  userID: number;
  userGuid?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  userName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: number;
  stateName?: string;
  countryId: number;
  countryName?: string;
  zipCode: string;
  emailID: string;
  companyList: Company[];
}


export interface EmployeeDetail{
    empId?: number;
    userID?: number;
    empCode?: string;
    dob: string;
    doh: string;
    departmentID: number;
    employeeStatusID: number;
    bloodGroup: string;
    companyId: number;
    roleId: number;
    emailID: string;
}

export interface UserBasic {
    userID: number;
    userGuid: string;
    firstName: string;
    lastName: string;
    middleName: string;
    userName: string;
    userTypeID: number;
    isActive?: boolean;
}

export interface UserPassKey {
    passKeyId: number;
    userID: number;
    passKey: string;
    saltKey: string;
    saltKeyIV: string;
}

export interface UserAddress {
    userAddressId: number;
    userID: number;
    addressTypeID: number;
    userAddressTypeName?: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateId: number;
    stateName?:string;
    countryId: number;
    countryName?:string;
    zipCode: string;
}

export interface UserEducation {
    educationId: number;
    userID: number;
    degreeName: string;
    instName: string;
    passingYear: string; // ISO string (e.g., '2025-05-02')
    percentage: number;
}

export interface UserBankDetail {
    bankDetailID: number;
    userID: number;
    bankName: string;
    ifscCode: string;
    accountNo: string;
}
