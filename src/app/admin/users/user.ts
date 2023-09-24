/**
 * Title: user.ts
 * Author: Yakut Ahmedin
 * Date: 9/16/23
 */

// imports statements
export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isDisabled: boolean
  language: string
  address: string
  password: string
  role: string
}

export interface NewUser {
  firstName: string
  lastName: string
  email: string
  password: string
  isDisabled: boolean
  role: string
}
