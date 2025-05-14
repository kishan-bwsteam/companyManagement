import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';
import { Position } from '../models/position.model';
import { GlobalService } from './global.service';
import { EmployeeDetail, EmployeeModel } from '../models/User.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient, private global: GlobalService) {

  }
  getall(companyId: any) {
    return this.http.get(this.global.baseUrl + "api/employee/" + companyId.toString());
  }
  // getSingle(id: any) {
  //   return this.http.get(this.global.baseUrl + "api/employee/Role/" + id);
  // }

  getByEmpId(employeeId: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(`${this.global.baseUrl}api/employee?EmpId=${employeeId}`);
  }
  getByUserId(userId: number): Observable<EmployeeModel> {
    return this.http.get<EmployeeModel>(`${this.global.baseUrl}api/employee?UserId=${userId}`);
  }
  create(emp: EmployeeModel) {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.post(this.global.baseUrl + "api/employee", emp, { headers: header });
  }
  update(emp: EmployeeDetail) {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.patch(this.global.baseUrl + "api/employee", emp, { headers: header });
  }
  delete(empId: any) {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.delete(this.global.baseUrl + "api/employee/" + empId, {headers : header});
  }
}