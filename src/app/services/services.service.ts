/**
 * Title: services.service.ts
 * Author: Professor Krasso
 * Date: 9/26/23
 * Updated by: Yakut Ahmedin
*/

// imports statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewInvoice } from '../services/invoice';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private http: HttpClient) { }

  // Function to create the service repair request
  createServiceRepair(invoice: NewInvoice) {
    return this.http.post('/api/invoices/service-repair', { invoice })
  }
}
