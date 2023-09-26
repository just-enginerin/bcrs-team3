import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceRepairService } from './service-repair.service';
import { NewInvoice } from './invoice';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})

export class ServiceRepairComponent {
  // Initialize the invoice form
  invoice: NewInvoice
  errorMessage: string
  isLoading: boolean = false

  // invoice form with validation
  invoiceForm = this.fb.group({
    customerFullName: [null, Validators.compose([Validators.required])],
    customerEmail: [null, Validators.compose([Validators.required, Validators.email])],
    partsAmount: [null, Validators.compose([Validators.required])],
    laborAmount: ['', Validators.compose([Validators.required])],
    lineItemTotal: ['', Validators.compose([Validators.required])],
    invoiceTotal: ['', Validators.compose([Validators.required])],
    orderDate: ['', Validators.compose([Validators.required])],
    lineItems: ['', Validators.compose([Validators.required])],
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private invoiceService: ServiceRepairService
  ) {

    this.errorMessage = '';
    this.invoice = {} as NewInvoice
  }

}
