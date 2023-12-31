/**
 * Title: invoice.ts
 * Author: Yakut Ahmedin
 * Date: 9/25/23
 */

export interface LineItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  checked: boolean;
}


export interface Invoice {
  userId: number
  customerFullName: string
  customerEmail: string
  partsAmount: number
  laborAmount: number
  lineItemTotal: number
  workspaceTotal: number
  taxTotal: number
  invoiceTotal: number
  orderDate: string
  lineItems: LineItem[];
}

