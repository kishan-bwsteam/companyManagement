import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';
import { Role } from '../models/role.model';
import { GlobalService } from './global.service';
import { AdminUser } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  constructor(private http: HttpClient, private global: GlobalService) {

  }

  getall() {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "api/createUser",{headers: headers});
  }
  getSingle(userId: any) {
    
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get(this.global.baseUrl + "api/createUser/user/" + userId, { headers: headers });
  }
  upsert(adminUser: AdminUser) {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post(this.global.baseUrl + "api/createUser", adminUser, { headers: headers });
  }
  delete(id: any) {
    return this.http.delete(this.global.baseUrl + "api/createUser/" + id);
  }
}
