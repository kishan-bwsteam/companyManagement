import { LeaveStatus } from "./leave-status.enum";

export default interface ChangeLeaveStatus{
    LeaveId: number,
    Status: LeaveStatus
}