/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by: William Egge
*/

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  // retrieve user information by ID from the API
  findUserById(userId: number) {
    return this.http.get('/api/users/' + userId)
  }

  signin(email: string, password: string) {
    return this.http.post('/api/security/signin', {
      email,
      password
    })
  }
}
