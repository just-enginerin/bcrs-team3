/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 * Updated by: William Egge
*/

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifySecurityQuestionsComponent } from './verify-security-questions/verify-security-questions.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        title: 'BCRS: Sign In'
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'BCRS: Register'
      },
      {
        path: 'forgot-password',
        component: VerifyEmailComponent,
        title: 'BCRS: Verify Email'
      },
      {
        path: 'verify-security-questions',
        component: VerifySecurityQuestionsComponent,
        title: 'BCRS: Verify Security Questions'
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'BCRS: Reset Password'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
