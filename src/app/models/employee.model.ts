import User from "./User.model"

export default interface Employee extends User{
    empID:number,
    employeeStatusID:number,
    companyID:number,
    userGuid:string,
    password:string,
    departmentID:10015,
    roleID:number,
    primaryPhoneNo:string,
    secondaryPhoneNo:string,
    isActive:boolean,
    empCode:number,
    dob?:Date,
    doh?:Date,
    bloodGroup:string,
}