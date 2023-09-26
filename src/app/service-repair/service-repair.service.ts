import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewInvoice } from './invoice';

@Injectable({
  providedIn: 'root'
})
export class ServiceRepairService {

  constructor(private http: HttpClient) { }

  // Function to submit the service repair request
  createServiceRepair(invoice: NewInvoice) {
    return this.http.post('/api/invoices/service-repair', { invoice })
  }
}