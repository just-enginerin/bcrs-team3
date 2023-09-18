/**
 * Title: signin.component.ts
 * Author: William Egge
 * Date: 9/16/23
 * Description: Sign In / User authentication logic
*/

// imports statements
import { Component } from '@angular/core';
import { SecurityService } from "./../security.service";
import { FormBuilder, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// the session user
export interface SessaionUser {
  empId: number;
  firstName: string;
  lastName: string;
}


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  errorMessage: string
  isLoading: boolean = false

  // signin form with validation
  signinForm = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])]
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private secService: SecurityService,
    private route: ActivatedRoute
  ) {
    this.errorMessage = ''
  }

  // Handle the sign-in process
  signin() {
    this.isLoading = true;

    console.log('Sign in Form:', this.signinForm.value)

    let email = this.signinForm.controls['email'].value
    let password = this.signinForm.controls['password'].value

    if (!email || !password) {
      this.errorMessage = 'Please provide an email address and password'
      this.isLoading = false;
      return
    }


    this.secService.signin(email, password).subscribe({
      next: (employee: any) => {
        console.log('Employee:', employee)

        const sessionCookie = {
          fullName: `${employee.firstName} ${employee.lastName}`,
          role: employee.role,
          empId: employee.empId
        }

        this.cookieService.set('session_user', JSON.stringify(sessionCookie), 1)
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
        this.isLoading = false
        this.router.navigate([returnUrl])
      },
      error: (err) => {
        this.isLoading = false

        console.log('err', err)

        if (err.error.status === 401) {
          this.errorMessage = err.message
          return
        }
      }
    })
  }
}
