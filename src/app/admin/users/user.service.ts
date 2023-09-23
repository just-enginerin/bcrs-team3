/**
 * Title: user.service.ts
 * Author: Yakut Ahmedin
 * Date: 9/16/23
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

  getUser(userId: string) {
    return this.http.get('/api/users/' + userId)
  }

  createUser(user: NewUser) {
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
