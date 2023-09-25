/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by: William Egge
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { selectedSecurityQuestionsViewModel } from './selected-security-questions-view-model';
import { Observable } from 'rxjs';
import { RegisterViewModel } from './register-view-model';

@Injectable({
  providedIn: 'root',
})

export class SecurityService {
  constructor(private http: HttpClient) { }

  /**
   * @description retrieve user information by ID from the API
   * @param userId
   * @returns user
   */
  findUserById(userId: number) {
    return this.http.get('/api/users/' + userId);
  }

  /**
   * @description Returns the register method
   */
  register(user: RegisterViewModel) {
    return this.http.post('/api/security/register', { user })
  }

  /**
   * @description Returns the signin method
   * @param email
   * @param password
   * @returns
   */
  signin(email: string, password: string) {
    return this.http.post('/api/security/signin', {
      email,
      password,
    });
  }

  /**
   * @description Returns the register method
   * @param email
   * @returns type any Observable
   */
  verifyEmail(email: string) {
    return this.http.post('/api/security/verify/users/' + email, {});
  }

  /**
   * @description Returns the findSelectedSecurityQuestions method
   * @param email
   * @returns type any Observable
   */
  findSelectedSecurityQuestions(email: string) {
    return this.http.get('/api/users/' + email + '/security-questions');
  }

  /**
   * @description Returns the verifySecurityQuestions method
   * @param email
   * @param securityQuestions
   * @returns type any Observable
   */
  verifySecurityQuestions(
    email: string,
    securityQuestions: selectedSecurityQuestionsViewModel[]
  ): Observable<any> {
    return this.http.post(
      '/api/security/verify/users/' + email + '/security-questions',
      {
        securityQuestions,
      }
    );
  }

  /**
   * @description Returns the changePassword method
   * @param email
   * @param password
   * @returns type any Observable
   */
  changePassword(email: string, password: string): Observable<any> {
    return this.http.delete('/api/security/users/' + email + '/reset-password', { body: { password } });
  }
}
