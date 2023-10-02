/**
 * Title: services.service.ts
 * Author: Professor Krasso
 * Date: 9/26/23
 * Updated by: Yakut Ahmedin
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ServicesService {

  constructor(private http: HttpClient) { }

  //  create  service invoice
  createInvoice(userId: number, invoice: Invoice) {
    return this.http.post('/api/invoices/' + userId, { invoice })
  }

  getInvoices() {
    return this.http.get('/api/invoices');
  }

  getInvoiceById(invoiceId: any) {
    return this.http.get('api/invoices/' + invoiceId)
  }

  findPurchasesByService(invoice: Invoice) {
    return this.http.get('/api/invoices/find-purchases-by-service?lineItems.name=' + name);
  }
}
