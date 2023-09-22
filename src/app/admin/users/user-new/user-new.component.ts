/**
 * Title: user-new.component.ts
 * Author: Yakut Ahmedin
 * Date: 9/16/23
 */

// imports statements
import { Component } from '@angular/core';
import { UserService } from './../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from '../user';
@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent {
  errorMessage: string

  userForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    phoneNumber: [''],
    address: [''],
    language: [''],
    isDisabled: [false],
    role: [null, Validators.compose([Validators.required])]
  })

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.errorMessage = ''
  }

  createUser() {
    const user: NewUser = {
      firstName: this.userForm.controls['firstName'].value,
      lastName: this.userForm.controls['lastName'].value,
      email: this.userForm.controls['email'].value,
      phoneNumber: this.userForm.controls['phoneNumber'].value,
      address: this.userForm.controls['address'].value,
      language: this.userForm.controls['language'].value,
      isDisabled: this.userForm.controls['isDisabled'].value === 'Active' ? true : false,
      role: this.userForm.controls['role'].value
    }

    this.userService.createUser(user).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/admin/users'])
      },
      error: (err) => {
        if (err.error.message) {
          this.errorMessage = err.error.message
        } else {
          this.errorMessage = 'Something went wrong, please contact system admin'
        }
      }
    })
  }
}
