/**
 * Title: verify-email.component.ts
 *  Author: Richard Krasso
 *  Date: 9/23/2023
 *  Edited By: William Egge
 *  Description: verify email component
 */

// Import required Angular modules and custom services
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';

// Component metadata
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  // Declare variables for error message and loading state
  errorMessage: string;
  isLoading: boolean = false;

  // Initialize the form group for the email verification form
  emailForm: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  // Constructor initializes FormBuilder, Router, and custom SecurityService
  constructor(
    private fb: FormBuilder, // Form builder service
    private router: Router, // Angular's router service
    private securityService: SecurityService // Custom security service
  ) {
    // Initialize error message
    this.errorMessage = '';
  }

  /**
   * Verify the email address entered by the user.
   */
  verifyEmail() {
    // Set loading state to true during API operation
    this.isLoading = true;

    // Retrieve email from form controls
    const email = this.emailForm.controls['email'].value;

    // Call the verifyEmail API method from the security service
    this.securityService.verifyEmail(email).subscribe({
      next: (res: any) => {
        // Log the successful response
        console.log(res);

        // Navigate to the next page with query parameters
        this.router.navigate(['security/verify-security-questions'], {
          queryParams: { email },
          skipLocationChange: true,
        });
      },
      error: (err: any) => {
        // Log and display any server errors
        console.log(`Server Error from verifyEmail Call: ${err}`);

        // Show appropriate error message based on the server response
        if (err.status === 404) this.errorMessage = 'Email not found';

        // Default error message
        this.errorMessage =
          'There was an issue verifying your email. Please contact the system administrator.';
      },
      complete: () => {
        // Always set loading state to false when the operation is complete
        this.isLoading = false;
      },
    });
  }
}
