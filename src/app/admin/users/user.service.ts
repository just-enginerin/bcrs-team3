/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { UserViewModel } from './user-view-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('/api/users')
  }

  getUser(userId: string) {
    return this.http.get('/api/users/' + userId)
  }

  createUser(user: User) {
    return this.http.post('/api/users/', {
      user
    })
  }

  updateUser(userId: string, user: UserViewModel) {
    return this.http.put('/api/users/' + userId, {
      user
    })
  }

  deleteUser(userId: string) {
    return this.http.delete('/api/users/' + userId)
  }
}
