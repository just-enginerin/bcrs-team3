/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  // retrieve employee information by ID from the API
  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }

  signin(email: string, password: string) {
    return this.http.post('/api/security/signin', {
      email,
      password
    })
  }
}
