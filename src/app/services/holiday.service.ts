import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Holiday } from '../models/holiday.model';
import { GlobalService } from './global.service';
import { PaginatedResult } from '../models/paginatedResult.modal';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http: HttpClient, private global: GlobalService) { }

  // Create or Update Holiday
  saveUpdate(holiday: Holiday): Observable<Holiday> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.post<Holiday>(this.global.baseUrl + "api/holiday", holiday, { headers: headers });
  }

  // Get Holiday by ID
  getById(holidayId: number): Observable<Holiday> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.get<Holiday>(`${this.global.baseUrl}api/holiday/${holidayId}`, { headers: headers });
  }
  getMyholidays(year:string):Observable<Holiday[]>{
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    let params = new HttpParams()
      .set('year', year)
    return this.http.get<Holiday[]>(this.global.baseUrl + "api/holiday/employee", { params: params, headers: headers });
  }
  // Get All Holidays with pagination and search
  getAll(companyID:number, limit: number = 10, startingRow: number = 0, search?: string): Observable<PaginatedResult<Holiday>> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('startingRow', startingRow.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResult<Holiday>>(this.global.baseUrl + "api/holiday/company/" + companyID.toString(), { params: params, headers: headers });
  }

  // Delete Holiday (if your API supports it)
  delete(holidayId: number): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return this.http.delete(`${this.global.baseUrl}api/holiday/${holidayId}`, { headers: headers });
  }
}