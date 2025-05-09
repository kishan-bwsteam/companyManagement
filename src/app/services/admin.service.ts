import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserBasic } from '../models/User.model';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginatedResult.modal';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private global: GlobalService) {

  }

  getAdmins(limit: number, startingRow: number):Observable<PaginatedResult<UserBasic>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('startingRow', startingRow.toString());

    return this.http.get<PaginatedResult<UserBasic>>(this.global.baseUrl + "api/admin/", { headers, params });
  }
  // getSingle(id:any){
  //   return this.http.get(this.global.baseUrl + "api/Department/Department/" + id);
  // }
  upsert(usr: UserBasic) {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.post(this.global.baseUrl + "api/Admin", usr, { headers: header });
  }
  // delete(id:any){
  //   return this.http.delete(this.global.baseUrl + "api/Department/" + id);
  // }
}
