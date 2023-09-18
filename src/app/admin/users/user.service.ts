/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewUser } from './user';
import { UserViewModel } from './user-view-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('/api/users')
  }

  getUser(_id: string) {
    return this.http.get('/api/users/' + _id)
  }

  createUser(user: NewUser) {
    return this.http.post('/api/users/', {
      user
    })
  }

  updateUser(_id: string, user: UserViewModel) {
    return this.http.put('/api/users/' + _id, {
      user
    })
  }

  deleteUser(_id: string) {
    return this.http.delete('/api/users/' + _id)
  }
}
