import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Employee from '../../models/employee.model';
import { CommonModule, DatePipe, } from '@angular/common';
import Bank from '../../models/bank.model';
import Address from '../../models/address.model';
import State from '../../models/state.model';
import Country from '../../models/country.model';
import { EmployeeService } from '../../services/employee.service';
import { GlobalService } from '../../services/global.service';
import { EmployeeModel, UserAddress } from '../../models/User.model';

@Component({
  selector: 'app-personal',
  imports: [DatePipe, CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  constructor(private global: GlobalService,
    private empService:EmployeeService
  ) {
   }
  ngOnInit(): void {
    
    this.getEmpdetails();
  }
  state: State[] = []
  country: Country[] = []
  empDetails: EmployeeModel = {
    userBasic: {
      userID: 0,
      userGuid: '',
      firstName: '',
      lastName: '',
      middleName: '',
      userName: '',
      userTypeID: 0,
      parentUserID: 0
    },
    userAddress: [],
    userEducation: [],
    userBankDetail: {
      bankDetailID: 0,
      userID: 0,
      bankName: '',
      ifscCode: '',
      accountNo: ''
    },
    dob: '',
    doh: '',
    departmentID: 0,
    employeeStatusID: 0,
    bloodGroup: '',
    companyId: 0,
    roleId: 0,
    emailID: ''
  };
  

  getEmpdetails(){
    this.empService.getByUserId(this.global.token.userId).subscribe((res:any)=>{
      this.empDetails = res;
    },(error)=>{
      console.log(error);
      
    })
  }
  // getDetails() {
  //   this.http.get("https://localhost:44363/api/EmpPersonalDetail/User/3").subscribe((res: any) => {
  //     if (res.status == 200 && res.singleModelList.length > 0) {
  //       this.empDetails = res.singleModelList[0];
  //     }

  //   }, (error) => {
  //     console.log(error);
  //   })
  // }
  // getAddress() {
  //   this.http.get("https://localhost:44363/api/EmpAddress/User/3").subscribe((res: any) => {
  //     if (res.status == 200 && res.singleModelList != undefined) {
  //       this.address = res.singleModelList;
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   })
  // }
  // getBankDetails() {
  //   this.http.get("https://localhost:44363/api/bank").subscribe((res: any) => {
  //     if (res.status == 200 && res.banklist.length > 0) {
  //       this.bankDetails = res.banklist.find((ob: Bank) => ob.userID == 3);
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   })
  // }
  getFormatedAddress(addr:UserAddress) {
    return addr?.addressLine1 + ", " + 
    addr?.addressLine2 + ", " + 
    addr?.city + ", " + 
    addr.stateName,
    addr.countryName;
  }
  getState(countryId:number,index:number) {
    this.global.getStatesByCountryId(countryId).subscribe((res: any) => {
      this.state[index] = res;
    }, (error) => {
      console.log(error);
    })
  }
  getCountry() {
    this.global.getCountries().subscribe((res: any) => {
      this.country = res;
    }, (error) => {
      console.log(error);
    })
  }
}
