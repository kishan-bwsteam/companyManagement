import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';
import { Position } from '../models/position.model';
import { GlobalService } from './global.service';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private company: CompanyService, private global: GlobalService) {

  }

  getall(userId: any) {
    return this.http.get(this.global.baseUrl + "api/Role/userId/" + userId.toString());
  }
  getSingle(roleId: any) {
    return this.http.get(this.global.baseUrl + "api/role/roleId/" + roleId);
  }
  upsert(role: Role) {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post(this.global.baseUrl + "api/Role", role,{headers:headers});
  }
  delete(id: any) {
    return this.http.delete(this.global.baseUrl + "api/role/" + id);
  }
}
