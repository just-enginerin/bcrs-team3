/**
 * Title: user-view.model.ts
 * Author: Yakut Ahmedin
 * Date: 9/16/23
 */

// imports statements
export interface UserViewModel {
  userId: string
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
  address: string
  language: string
  isDisabled: boolean
  role: string
  selectedSecurityQuestions: {
    questionText: string;
    answerText: string;
  }[];
}
