/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
*/

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface SessionUser {
  fullName: string
  role: string
  avatar: string,
  userId: number
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  sessionUser: SessionUser
  isSignedIn: boolean

  constructor(private cookieService: CookieService) {

    this.sessionUser = {} as SessionUser // Initialize appUser as an empty object

    // Initialize isSignedIn based on the existence of a session_user cookie
    this.isSignedIn = this.cookieService.get('session_user') ? true : false

    // If the user is signed in, set the appUser's fullName based on the session_name cookie
    if (this.isSignedIn) {
      this.sessionUser = JSON.parse(this.cookieService.get('session_user'))
      console.log('Session User:', this.sessionUser)
    }
  }

  // Function to sign out the user
  signout() {
    // Delete all cookies and redirect to the root URL
    this.cookieService.deleteAll()
    window.location.href = '/'
  }
}
