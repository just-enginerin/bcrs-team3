/**
 * Title: verify-email.component.ts
 *
 * date: 9/22/2023
 */


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  errorMessage: string;
  isLoading: boolean = false;

  emailForm: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.errorMessage = '';
  }

  /**
   * Verify the email address entered by the user.
   */
  verifyEmail() {
    this.isLoading = true;

    const email = this.emailForm.controls['email'].value;

    this.securityService.verifyEmail(email).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate(['security/verify-security-questions'], {
          queryParams: { email },
          skipLocationChange: true,
        });
      },
      error: (err: any) => {
        console.log(`Server Error from verifyEmail Call: ${err}`);

        if (err.status === 404) this.errorMessage = 'Email not found';

        this.errorMessage =
          'There was an issue verifying your email. Please contact the system administrator.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
