import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { AddressType } from '../models/addressType.model';

@Injectable({
  providedIn: 'root'
})
export class AddressTypeService {

  constructor(private http:HttpClient, private global:GlobalService) { 
    
  }
  // Get all address types
  getAllAddressTypes(): Observable<AddressType[]> {
    return this.http.get<AddressType[]>(`${this.global.baseUrl}api/AddressType`);
  }

  // Save or update an address type
  saveOrUpdateAddressType(addressType: AddressType): Observable<any> {
    return this.http.post(`${this.global.baseUrl}api/AddressType`, addressType);
  }
}
