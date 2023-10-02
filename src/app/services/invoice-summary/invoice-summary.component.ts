/**
 *  Title: invoice-summary.component.ts
 * Author: Erin Brady
 * Date: 9/30/23
 * Description: Invoice Summary logic
 */

import { Component, OnInit } from '@angular/core';
import { Invoice, LineItem } from '../invoice';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ServicesService } from '../services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionUser } from 'src/app/layouts/nav/nav.component';
import { User } from 'src/app/admin/users/user';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.css']
})

export class InvoiceSummaryComponent implements OnInit {
  user!: SessionUser;
  invoice: Invoice
  invoiceId: number = 0;

  successMessage: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = '';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: ServicesService,
    private datePipe: DatePipe
  ) {

    const sessionUser = JSON.parse(this.cookieService.get('session_user'));
    this.user = sessionUser;

      // Access the invoiceId from route parameters
    this.route.params.subscribe((params) => {
      this.invoiceId = params['state'];
      console.log('invoiceId:', this.invoiceId);
    });

    this.invoice = {} as Invoice

    // User the invoiceId to retrieve the data for this invoice.
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
      next: (invoice: any) => {
        this.invoice = invoice
        console.log("invoice: ", this.invoice)
        console.log("user: ", this.user)
      },
      error: (err) => {
        console.error(err)
      }
    })

    console.log("invoice: ", this.invoice)
    console.log("user: ", this.user)
  }

  ngOnInit() { }

  printPage() {
    window.print();
  }
}
