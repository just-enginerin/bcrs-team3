/**
 * Title: reset-password.component.ts
 *  Author: Richard Krasso
 *  Date: 9/23/2023
 *  Edited By: William Egge
 *  Description: reset password component
 */

// Import required modules and services
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../security.service';
import { ActivatedRoute, Router } from '@angular/router';

// Define the Angular component metadata
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  // Declare variables for error message, email, and loading state
  errorMessage: string;
  email: string;
  isLoading: boolean = false;

  // Initialize the form group for the password change form
  changePasswordForm: FormGroup = this.fb.group({
    password: [
      null,
      Validators.compose([
        Validators.required,
        // Regex pattern for strong password validation
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$'
        ),
      ]),
    ],
  });

  // Constructor initializes various services and reads email from query params
  constructor(
    private fb: FormBuilder, // Form builder service
    private securityService: SecurityService, // Custom security service
    private route: ActivatedRoute, // Angular's route service
    private router: Router // Angular's router service
  ) {
    // Retrieve email from the query parameters
    this.email = this.route.snapshot.queryParams['email'] ?? '';
    this.errorMessage = '';

    // If no email is found, redirect to the sign-in page
    if (!this.email) {
      console.log('No email found');
      this.router.navigate(['/security/sign-in']);
    }
  }

  // Method to change the password
  changePassword() {
    // Set loading state to true during API operation
    this.isLoading = true;

    // Get the new password from the form controls
    const password = this.changePasswordForm.controls['password'].value;

    // Call the changePassword API method from the security service
    this.securityService.changePassword(this.email, password).subscribe({
      next: (data: any) => {
        // Log the successful response and navigate to the sign-in page
        console.log(data);
        this.router.navigate(['/security/signin']);
      },
      error: (err: any) => {
        // Log and display any server errors
        console.log(`Server Error from changePassword Call: ${err}`);
        this.errorMessage = err;
        // Set loading state to false when the operation is complete
        this.isLoading = false;
      },
      complete: () => {
        // Always set loading state to false when the operation is complete
        this.isLoading = false;
      },
    });
  }
}
