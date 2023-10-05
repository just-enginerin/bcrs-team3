/**
 * Title: signin.component.ts
 * Author: William Egge
 * Date: 9/16/23
 * Description: Sign In / User authentication logic
 * Random User Generator API: https://randomuser.me/
*/

// imports statements
import { Component } from '@angular/core';
import { SecurityService } from "./../security.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionUser } from 'src/app/layouts/nav/nav.component';


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
      next: (user: any) => {
        console.log('User:', user)

        const sessionCookie = {
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          userId: user.userId,
          avatar: this.randomAvatar()
        }

        this.cookieService.set('session_user', JSON.stringify(sessionCookie), 1)
        this.isLoading = false
        this.router.navigate(["/services/service-repair"])
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

    // Generate the URL for a random user avatar
  randomAvatar() {
    const MIN = 1;
    const MAX = 71;

    // Generate a random integer between min and max (inclusive)
    const randomIndex = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    // Generate a random number (0 or 1)
    const randomNum = Math.floor(Math.random() * 2);

    // Use the random number to decide the gender
    const randomGender = randomNum === 0 ? "men" : "women";

    const randomLink = `https://randomuser.me/api/portraits/${randomGender}/${randomIndex}.jpg`

    console.log("random avatar link:", randomLink)

    return randomLink
  }
}
