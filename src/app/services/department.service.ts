import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/department.model';
import { CompanyService } from '../company/company.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http:HttpClient, private company:CompanyService,private global:GlobalService) { 
    
  }
  
  getall(companyId:any){
    return this.http.get(this.global.baseUrl + "api/Department/" + companyId.toString());
  }
  getSingle(id:any){
    return this.http.get(this.global.baseUrl + "api/Department/Department/" + id);
  }
  upsert(dep:Department){
    return this.http.post(this.global.baseUrl + "api/Department", dep);
  }
  delete(id:any){
    return this.http.delete(this.global.baseUrl + "api/Department/" + id);
  }
}
