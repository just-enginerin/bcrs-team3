/**
 * Title: verify-security-questions.component.ts
 *  Author: Richard Krasso
 *  Date: 9/23/2023
 *  Edited By: William Egge
 *  Description: verify security questions component
 */

// Import required modules and services
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../security.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectedSecurityQuestionsViewModel } from '../selected-security-questions-view-model';

// Component Metadata
@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css'],
})
export class VerifySecurityQuestionsComponent {
  // Declare component variables
  selectedSecurityQuestions: selectedSecurityQuestionsViewModel[];
  email: string;
  errorMessage: string;
  isLoadingLabels: boolean;
  isLoadingSubmit: boolean;
  question1: string;
  question2: string;
  question3: string;

  // Initialize Form Group for Angular Reactive Forms
  securityQuestionsForm: FormGroup = this.fb.group({
    answer1: [null, Validators.compose([Validators.required])],
    answer2: [null, Validators.compose([Validators.required])],
    answer3: [null, Validators.compose([Validators.required])],
  });

  // Component constructor to initialize services and variables
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService,
    private fb: FormBuilder
  ) {
    // Initializations
    this.selectedSecurityQuestions = [];
    this.question1 = '';
    this.question2 = '';
    this.question3 = '';
    this.errorMessage = '';
    this.isLoadingLabels = false;
    this.isLoadingSubmit = false;

    // Get the email from the route parameters
    this.email = this.route.snapshot.queryParams['email'] ?? '';//check later to make sure it is working correctly
    console.log(this.email);

    // If no email is provided, redirect to forgot password page
    if (!this.email) {
      this.router.navigate(['/security/forgot-password']);
    }

    // Fetch selected security questions for the given email
    this.securityService.findSelectedSecurityQuestions(this.email).subscribe({
      next: (data: any) => {
        this.selectedSecurityQuestions = data.selectedSecurityQuestions;
      },
      error: (err: any) => {
        // Handle errors from the server
        if (err.status === 404) {
          this.errorMessage = 'Email not found';
          return;
        } else {
          this.errorMessage = 'Security questions verified. Please try again.';
        }
        this.isLoadingLabels = false;
      },
      complete: () => {
        // Update security questions once the data is fetched
        this.question1 = this.selectedSecurityQuestions[0].question;
        this.question2 = this.selectedSecurityQuestions[1].question;
        this.question3 = this.selectedSecurityQuestions[2].question;
        this.isLoadingLabels = false;
      },
    });
  }

  // Method to verify answers to security questions
  verifySecurityQuestions() {
    this.isLoadingSubmit = true;
    console.log(this.securityQuestionsForm.value);

    // Prepare the data to send to the server
    let securityQuestions = [
      {
        question: this.question1,
        answer: this.securityQuestionsForm.controls['answer1'].value,
      },
      {
        question: this.question2,
        answer: this.securityQuestionsForm.controls['answer2'].value,
      },
      {
        question: this.question3,
        answer: this.securityQuestionsForm.controls['answer3'].value,
      },
    ];

    // Send the security questions and answers to the server for verification
    this.securityService
      .verifySecurityQuestions(this.email, securityQuestions)
      .subscribe({
        next: (res: any) => {
          // Navigate to the reset-password page on successful verification
          this.router.navigate(['/security/reset-password'], {
            queryParams: { email: this.email },
            skipLocationChange: true,
          });
        },
        error: (err: any) => {
          // Handle server errors
          if (err.error.message) {
            this.errorMessage = err.error.message;
            return;
          } else {
            this.errorMessage =
              'There was an issue verifying your security questions. Please try again.';
            this.isLoadingSubmit = false;
          }
        },
        complete: () => {
          this.isLoadingSubmit = false;
        },
      });
  }
}
