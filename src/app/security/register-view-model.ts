import { selectedSecurityQuestionsViewModel } from "./selected-security-questions-view-model";

/**
 * Interface for the RegisterViewModel
 * @property firstName
 * @property lastName
 * @property email
 * @property password
 * @property selectedSecurityQuestions
 * @example:
 * {
 *  firstName: 'John',
 *  lastName: 'Doe',
 *  email: 'doe@bcrs.com',
 *  password: 'Password01',
 *  selectedSecurityQuestions: [
 *    { question: 'What is your mother's maiden name?',
 *      answer: 'Smith'
 *    }
 *  ]
 * }
 */

export interface RegisterViewModel {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  address: string
  language: string
  selectedSecurityQuestions: selectedSecurityQuestionsViewModel[];
}
