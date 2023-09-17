/**
 * Title: auth.guard.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'

export const authGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService)

  // Check if the user has a valid session cookie.
  if (cookie.get("session_user")) {
    console.log("Your are logged in and have a vaild session cookies");
    return true;
  } else {
    console.log('You must be logged in to access this page!');
    const router = inject(Router)

    // Redirect to the signin page.
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url } })
    return false
  }
};
