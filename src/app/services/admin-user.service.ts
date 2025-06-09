import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';
import { Role } from '../models/role.model';
import { GlobalService } from './global.service';
import { AdminUser } from '../models/User.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  constructor(private http: HttpClient, private global: GlobalService) {}

  private getHeaders(): HttpHeaders{
    const token = sessionStorage.getItem("token");
    return new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  }
  getall():Observable<any> {
    return this.http.get(this.global.baseUrl + "api/CreateUser/AllAdmins",{headers: this.getHeaders()});
  }
  getSingle(userId: any) {
    
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "api/CreateUser/user/" + userId, { headers: headers });
  }
  upsert(adminUser: AdminUser) {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post(this.global.baseUrl + "api/CreateUser", adminUser, { headers: headers });
  }
  delete(id: any) {
    return this.http.delete(this.global.baseUrl + "api/CreateUser/" + id);
  }
}
