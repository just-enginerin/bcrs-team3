/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
export interface UserViewModel {
  _id: string
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
  address: string
  language: string
  isDisabled: string
  role: string
  selectedSecurityQuestions: {
    questionText: string;
    answerText: string;
  }[];
}
