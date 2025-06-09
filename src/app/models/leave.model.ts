import Employee from "./employee.model"
export interface Leave{
    id:number,
    employeeId?:number,
    employee?:Employee,
    managerId?:number,
    manager?:Employee,
    reason:string,
    leaveTypeId:number,
    leaveFrom:Date,
    leaveTo:Date,
    leaveDeduct?:number,
    duration?:string,
    createdAt?:Date
    status?:LeaveStatus
}

export interface LeaveRequestData {
  companyID: number;
  companyGuid: string;
  companyName: string;

  empCode: string;
  userName:string;
  empFullName:string;
  departmentID: number;
  departmentName: string;

  roleID: number;
  roleName: string;

  employeeStatusID: number;
  statusName: string;

  leaveRequestID: number;
  leaveStatusId: number;
  leaveStatusName: string;
  fromDate: string;        
  toDate: string;
  leaveReasonId: number;
  reasonName: string;
  leaveDate: string;
  attachmentName:string
}

export interface LeaveStatus{
  leaveStatusId:number,
  statusName:string
}