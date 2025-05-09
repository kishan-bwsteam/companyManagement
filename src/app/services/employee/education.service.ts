import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../../company/company.service';
import { Department } from '../../models/department.model';
import { GlobalService } from '../global.service';
import { UserEducation } from '../../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  
    constructor(private http:HttpClient, private company:CompanyService,private global:GlobalService) { 
      
    }
    
    // getall(companyId:any){
    //   return this.http.get(this.global.baseUrl + "api/Department/" + companyId.toString());
    // }
    // getSingle(id:any){
    //   return this.http.get(this.global.baseUrl + "api/Department/Department/" + id);
    // }
    upsert(edu:UserEducation){
        var token = sessionStorage.getItem("token");
        var header = new HttpHeaders({
          "Authorization": "Bearer " + token
        })
      return this.http.post(this.global.baseUrl + "api/Education", edu,{headers:header});
    }
    // delete(id:any){
    //   return this.http.delete(this.global.baseUrl + "api/Department/" + id);
    // }
}
