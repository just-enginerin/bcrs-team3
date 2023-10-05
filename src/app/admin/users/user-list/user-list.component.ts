/**
 * Title: user-list.compnent.ts
 * Author: Yakut Ahmedin
 * Date: 9/16/23
 */

// imports modules and components
import { Component } from '@angular/core';
import { UserService } from '../user.service'
import { User } from '../user'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  // Initialize component properties
  users: User[]
  successMessage: string
  errorMessage: string
  isLoading: boolean

  // Constructor with dependency injection
  constructor(private userService: UserService) {
    this.users = []
    this.successMessage = ''
    this.errorMessage = ''
    this.isLoading = true

    // Fetch user data from the service when the component is created
    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users
        console.log('User List:', this.users)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        console.log(err)
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }

  // delete a user by ID
  deleteUser(userId: string) {
    if (!confirm('Are you sure you want to deactivate user record ' + userId + '?')) {
      return
    }

    this.userService.deleteUser(userId).subscribe({
      next: (res) => {

        // update the user status
        this.users = this.users.map(user => {
          if (user.userId === userId) {
            // Update the user's status
            user.isDisabled = true;
          }
          return user;
        })

        this.successMessage = 'User status changed successfully'

        this.hideAlert()
      },
      error: (err) => {
        if (err.status === 400) {
          // Parse the error response to get the error message
          const errorResponse = err.error;
          if (errorResponse && errorResponse.message) {
            this.errorMessage = errorResponse.message;
          } else {
            this.errorMessage = 'Bad Request: Something went wrong.';
          }
        } else {
          this.errorMessage = 'An error occurred while processing your request.';
        }
        console.error(err);
        this.hideAlert(); // Hide the error message after a delay
      }
    })
  }



  //  hide success and error messages after a delay
  hideAlert() {
    setTimeout(() => {
      this.successMessage = ''
      this.errorMessage = ''
    }, 3000)
  }
}

