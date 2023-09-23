/**
 * Title: employee-list.service.ts
 * Author: Yakut Ahmedin
 * Date: 9/23/23
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('/api/users')
  }
}
