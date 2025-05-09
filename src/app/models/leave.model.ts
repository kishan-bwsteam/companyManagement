import Employee from "./employee.model"
import { LeaveStatus } from "./leave-status.enum"

export default interface Leave{
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
