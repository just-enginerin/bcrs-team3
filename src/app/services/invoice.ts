/**
 * Title: invoice.ts
 * Author: Yakut Ahmedin
 * Date: 9/25/23
 */

export interface NewInvoice {
  customerFullName: string
  customerEmail: string
  partsAmount: number
  laborAmount: number
  lineItemTotal: number
  invoiceTotal: number
  orderDate: string
  lineItems: {
    name: string;
    price: number;
  }[];
}
