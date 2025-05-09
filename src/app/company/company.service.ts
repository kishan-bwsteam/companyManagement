import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/department.model';
import { Company } from '../models/company.model';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http:HttpClient,private global:GlobalService) { }

  // companyId = 0

  
  
  getall(){
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.get(this.global.baseUrl + "api/Company/",{headers: header});
  }
  getSingle(id:any){
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.get(this.global.baseUrl + "api/Company/" + id,{headers: header});
  }
  upsert(param:Company){
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.post(this.global.baseUrl + "api/Company", param,{headers: header});
  }
  delete(id:any){
    var token = sessionStorage.getItem("token");
    var header = new HttpHeaders({
      "Authorization": "Bearer " + token
    })
    return this.http.delete(this.global.baseUrl + "api/Company/" + id,{headers: header});
  }

}
