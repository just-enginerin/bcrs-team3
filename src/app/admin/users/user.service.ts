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

  // get a list of users from the API
  getUsers() {
    return this.http.get('/api/users')
  }

  // get a specific user by their ID from the API
  getUser(userId: string) {
    return this.http.get('/api/users/' + userId)
  }

  // Create a new user by sending a POST request to the API
  createUser(user: NewUser) {
    return this.http.post('/api/users/', {
      user
    })
  }

  // Update an existing user's information by sending a PUT request to the API
  updateUser(userId: string, user: UserViewModel) {
    return this.http.put('/api/users/' + userId, {
      user
    })
  }

  // Delete a user by their ID using a DELETE request to the API
  deleteUser(userId: string) {
    return this.http.delete('/api/users/' + userId)
  }
}
