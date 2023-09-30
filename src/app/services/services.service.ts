/**
 * Title: services.service.ts
 * Author: Professor Krasso
 * Date: 9/26/23
 * Updated by: Yakut Ahmedin
*/

// imports statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  //  create  service invoice
  createInvoice(userId: number, invoice: Invoice) {
    return this.http.post('/api/invoices/' + userId, { invoice })
  }
}
