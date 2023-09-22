/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserViewModel } from '../user-view-model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {
  userId!: string // define the userId variable
  user: User // define the user variable

  // define the userForm variable and assign it to the FormGroup
  userForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [''],
    language: [''],
    address: [''],
    isDisabled: [null, Validators.compose([Validators.required])],
    role: [null, Validators.compose([Validators.required])],
  })

  // inject the ActivatedRoute, UserService, Router, and FormBuilder into the constructor
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {

    this.user = {} as User // initialize the user model
    let l__id = this.route.snapshot.paramMap.get('userId') || '' // get the userId from the route
    this.userId = l__id; // Keep userId as a string

    console.log(this.userId) // log the userId to the console

    // call the userService findUserById() function and subscribe to the observable
    this.userService.getUser(this.userId).subscribe({
      next: (user: any) => {
        this.user = user // assign the results to the user model
        console.log(this.user) // log the results to the console
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.userForm.controls['firstName'].setValue(this.user.firstName)
        this.userForm.controls['lastName'].setValue(this.user.lastName)
        this.userForm.controls['phoneNumber'].setValue(this.user.phoneNumber)
        this.userForm.controls['address'].setValue(this.user.address)
        this.userForm.controls['language'].setValue(this.user.language)
        this.userForm.controls['isDisabled'].setValue(this.user.isDisabled)
        this.userForm.controls['role'].setValue(this.user.role)
      }
    })
  }

  // updateUser() function definition that accepts no parameters and returns nothing (void)
  updateUser() {
    let user = {} as UserViewModel // initialize the user view model

    // assign the values from the form to the user view model
    user.firstName = this.userForm.controls['firstName'].value
    user.lastName = this.userForm.controls['lastName'].value
    user.phoneNumber = this.userForm.controls['phoneNumber'].value
    user.address = this.userForm.controls['address'].value
    user.language = this.userForm.controls['language'].value
    user.isDisabled = this.userForm.controls['isDisabled'].value === "true" ? true : false
    user.role = this.userForm.controls['role'].value


    console.log('User ViewModel: ', user) // log user view model

    // call the userService updateUser() function and subscribe to the observable
    this.userService.updateUser(this.userId, user).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/admin/users']) // redirect to the user list page
      },
      error: (err) => {
        console.error(err) // log the error to the console
      }
    })
  }
}
