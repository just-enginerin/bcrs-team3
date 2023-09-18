/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isDisabled: string
  language: string
  address: string
  password: string
  role: string
}

export interface NewUser {
  firstName: string
  lastName: string
  email: string
  isDisabled: string
  password: string
  role: string
}