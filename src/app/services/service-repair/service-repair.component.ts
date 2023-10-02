/**
 * Title: services-repair.component.ts
 * Author: Professor Krasso
 * Date: 9/25/23
 * Updated by: Yakut Ahmedin
*/

// imports statements
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice, LineItem } from '../invoice';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css'],
  providers: [DatePipe],
})

export class ServiceRepairComponent {
  // variables
  userId!: number;
  userName: string = '';
  orderDate: string = '';
  lineItems: LineItem[] = [];
  tax: number = 0;

  workspaceTotal: number = 0;
  lineItemTotal: number = 0;
  invoiceTotal: number = 0;
  invoice: Invoice[] = [];
  invoiceForm!: FormGroup;

  lineItemChecked: LineItem[] = [];

  successMessage: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = '';

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router,
    private invoiceService: ServicesService,
    private datePipe: DatePipe
  ) {
    const sessionUser = JSON.parse(this.cookieService.get('session_user'));
    this.userId = sessionUser.userId;
    this.userName = sessionUser.fullName;

    this.lineItems = [
      { id: 1, name: "Password Reset", price: 39.99, quantity: 0, checked: false },
      { id: 2, name: "Spyware Removal", price: 99.99, quantity: 0, checked: false },
      { id: 3, name: "RAM Upgrade", price: 129.99, quantity: 0, checked: false },
      { id: 4, name: "Software Installation", price: 49.99, quantity: 0, checked: false },
      { id: 5, name: "PC Tune-up", price: 89.99, quantity: 0, checked: false },
      { id: 6, name: "Keyboard Cleaning", price: 45.00, quantity: 0, checked: false },
      { id: 7, name: "Disk Clean-up", price: 129.99, quantity: 0, checked: false }
    ]

  }

  ngOnInit() {
    setInterval(() => {
      this.orderDate = this.generateOrderDate();
    }, 1000);

    this.invoiceForm = this.fb.group({
      customerFullName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      partsAmount: [0, [Validators.min(0)]],
      laborAmount: [0, [Validators.min(0)]],
      lineItems: this.fb.array([]),
      lineItemTotal: [{ value: 0, disabled: true }],
      invoiceTotal: [{ value: 0, disabled: true }],
    });

    // Call isItemChecked for each line item to initialize the lineItemChecked array
    this.lineItemChecked = this.lineItems.filter((lineItem) => lineItem.checked);

    this.invoiceForm.valueChanges.subscribe(() => {
      this.updateWorkspaceTotal();
      this.updateLineItemTotal();
      this.calculateTax();
      this.updateInvoiceTotal();
    });
  }


  createInvoice() {
    this.isLoading = true
    const { customerFullName, customerEmail, partsAmount, laborAmount } = this.invoiceForm.value;

    console.log("The array for lineItemChecked", this.lineItemChecked);

    const invoice: Invoice = {
      userId: this.userId,
      customerFullName,
      customerEmail,
      partsAmount,
      laborAmount,
      lineItems: this.lineItemChecked,
      orderDate: this.generateOrderDate(),
      taxTotal: this.tax,
      workspaceTotal: this.workspaceTotal,
      lineItemTotal: this.calculateLineItemTotal(this.lineItemChecked),
      invoiceTotal: partsAmount + laborAmount + this.calculateLineItemTotal(this.lineItemChecked),
    };

    this.invoice.push(invoice);
    console.log('Invoice Listing:', this.invoice);

    if (partsAmount > 0 || laborAmount > 0 || this.lineItemChecked.length > 0) {
      console.log("Form is valid");

      this.invoiceService.createInvoice(this.userId, invoice).subscribe({
        next: (res: any) => {
          console.log('Invoice created successfully:', res);

          this.isLoading = false
          this.successMessage = 'Invoice created successfully'

          // Carry the Invoice ID to the Invoice Summary page
          this.router.navigate(['/services/invoice-summary', {state: res.invoiceId}])
        },
        error: (err) => {
          this.isLoading = false
          if (err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Something went wrong, please contact the system admin.';
          }
        }
      });

      this.lineItems.forEach((item) => {
        item.checked = false;
        item.quantity = 0;
      });

    } else {
      console.log("Form is invalid");
      this.errorMessage = "Form is invalid! at least one of the workspace and line Items form filled must be used";
      this.isLoading = false
    }
  }

  generateOrderDate(): string {
    const now = new Date();
    return this.datePipe.transform(now, 'MM/dd/yyyy h:mm:ss a') || '';
  }

  calculateLineItemTotal(lineItems: LineItem[]): number {
    return lineItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  // update the workspace total
  updateWorkspaceTotal() {
    const partsAmount = this.invoiceForm.get('partsAmount')?.value || 0;
    const laborAmount = this.invoiceForm.get('laborAmount')?.value || 0;
    this.workspaceTotal = partsAmount + laborAmount;
  }

  // Function to update the line item total
  updateLineItemTotal() {
    this.lineItemTotal = this.lineItemChecked.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    this.lineItemTotal = +this.lineItemTotal.toFixed(2);
    this.calculateTax();
    this.updateInvoiceTotal();
  }

  // Function to update tax based on your tax calculation logic
  calculateTax() {
    const taxRate = 0.055;
    this.tax = this.lineItemTotal * taxRate + this.workspaceTotal * taxRate;
    this.updateInvoiceTotal();
  }

  // Function to get invoice total
  updateInvoiceTotal() {
    this.invoiceTotal = this.workspaceTotal + this.tax + this.lineItemTotal;
  }

  isItemChecked(lineItem: LineItem) {
    console.log("line item: ", lineItem);
    lineItem.checked = !lineItem.checked;

    if (lineItem.checked) {
      lineItem.quantity = 1;
      this.lineItemChecked.push(lineItem); // Push checked item to the lineItemChecked array
    } else {
      // Remove unchecked item from the lineItemChecked array
      const index = this.lineItemChecked.findIndex(item => item === lineItem);
      if (index !== -1) {
        lineItem.quantity = 0;
        this.lineItemChecked.splice(index, 1);
      }
    }

    console.log("lineItemChecked", this.lineItemChecked);

    // Calculate the lineItemTotal based on checked items in lineItemChecked
    this.lineItemTotal = this.lineItemChecked.reduce((total, item) => (total + item.price), 0);

    console.log("is Checked", this.lineItemChecked);
    console.log("line item total: ", this.lineItemTotal);
    this.updateLineItemTotal();
    this.calculateTax();
    return lineItem.checked;
  }

  // Function to decrease quantity
  decreaseQuantity(event: Event, index: number, id: number) {
    event.preventDefault();
    const item = this.lineItemChecked.find((lineItem) => lineItem.id === id);
    console.log("decrease item quantity: ", item);

    if (item && item.quantity > 0) {
      item.quantity--;
      this.updateLineItemTotal();
    }
  }

  // Function to increase quantity
  increaseQuantity(event: Event, index: number, id: number) {
    event.preventDefault();
    const item = this.lineItemChecked.find((lineItem) => lineItem.id === id);
    console.log("increase item quantity: ", item);

    if (item) {
      item.quantity++;
      this.updateLineItemTotal();
    }
  }

  clearInput(inputField: HTMLInputElement) {
    inputField.value = ''; // Clear the input value
  }
}
