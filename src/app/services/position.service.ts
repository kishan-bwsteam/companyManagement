import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyService } from '../company/company.service';
import { Department } from '../models/department.model';
import { GlobalService } from './global.service';
import { Position } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  constructor(private http: HttpClient, private company: CompanyService, private global: GlobalService) {

  }

  getall(companyId:any){
    return this.http.get(this.global.baseUrl + "api/position/" + companyId.toString());
  }
  getSingle(id: any) {
    return this.http.get(this.global.baseUrl + "api/position/Role/" + id);
  }
  upsert(dep: Position) {
    return this.http.post(this.global.baseUrl + "api/position", dep);
  }
  delete(id:any){
    return this.http.delete(this.global.baseUrl + "api/position/" + id);
  }
}
