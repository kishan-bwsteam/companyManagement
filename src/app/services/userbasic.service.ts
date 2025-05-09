import { Injectable } from '@angular/core';
import { UserBasic } from '../models/User.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UserbasicService {
  constructor(private http: HttpClient, private global: GlobalService) {

  }

  // getall(companyId:any){
  //   return this.http.get(this.global.baseUrl + "api/Department/" + companyId.toString());
  // }
  // getSingle(id:any){
  //   return this.http.get(this.global.baseUrl + "api/Department/Department/" + id);
  // }
  upsert(usr: UserBasic) {
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.post(this.global.baseUrl + "api/User", usr, { headers: header });
  }
  // delete(id:any){
  //   return this.http.delete(this.global.baseUrl + "api/Department/" + id);
  // }
}
