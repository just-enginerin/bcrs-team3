/**
 * Title: profile.component.css
 * Author: Erin Brady
 * Date: 9/28/23
 * Description: Profile page logic
*/

import { Component } from '@angular/core';
import { inject } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { UserService } from '../admin/users/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserViewModel } from '../admin/users/user-view-model';
import { FormGroup } from '@angular/forms';
import { User } from '../admin/users/user';
import { SessionUser } from '../layouts/nav/nav.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  // Initialize variables
  user: User
  sessionUser: SessionUser
  role: string
  lastSignedIn: string

  errorMessage: string
  profileOnSaveError: string
  profileOnSaveSuccess: string
  isEditMode: boolean = false; // Whether profile is in edit mode
  isAlertVisible: boolean = false;

  // Initial editable profile info
  initialUserPhone: string = '';
  initialUserAddress: string = '';
  initialUserLanguage: string = '';

  // Edit Profile form fields
  profileForm: FormGroup = this.fb.group({
    phoneNumber: [''],
    language: [''],
    address: ['']
  })

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private fb: FormBuilder) {

    this.user = {} as User
    this.errorMessage = ''
    this.profileOnSaveError = ''
    this.profileOnSaveSuccess = ''
    this.role = ''
    this.sessionUser = {} as SessionUser
    this.lastSignedIn = ''

    // Get the currently signed in userId
    const cookie = JSON.parse(this.cookieService.get('session_user'))

    console.log('profile cookie: ', cookie)
    this.sessionUser = cookie

    // Fetch user data for the currently signed in user
    this.userService.getUser(cookie.userId).subscribe({
      next: (user: any) => {
        this.user = user
        console.log("user: ", this.user)

        // Update form fields with the latest data
        this.profileForm.controls['phoneNumber'].setValue(this.user.phoneNumber);
        this.profileForm.controls['address'].setValue(this.user.address);
        this.profileForm.controls['language'].setValue(this.user.language);

        this.lastSignedIn = this.formatDate(this.user.lastSignedIn);
      },
      error: (err) => {
        console.log(err)
        this.errorMessage = err.message
      },
      complete: () => {
        // set default field values in profile form
        this.profileForm.controls['phoneNumber'].setValue(this.user.phoneNumber)
        this.profileForm.controls['address'].setValue(this.user.address)
        this.profileForm.controls['language'].setValue(this.user.language)

        this.lastSignedIn = this.formatDate(this.user.lastSignedIn)
      }
    })
  }

  // Save values from Edit Profile form
  saveChanges() {
    let user = {} as UserViewModel // initialize the user view model

    // assign the values from the profile form to the user view model
    user.firstName = this.user.firstName
    user.lastName = this.user.lastName
    user.phoneNumber = this.profileForm.controls['phoneNumber'].value
    user.address = this.profileForm.controls['address'].value
    user.language = this.profileForm.controls['language'].value
    user.isDisabled = false
    user.role = this.user.role

    console.log(`Saving values: ${user}`)

    // updateUser API call
    this.userService.updateUser(this.user.userId, user).subscribe({
      next: (res) => {
        console.log(res);
        this.profileOnSaveSuccess = 'Profile saved successfully!';
        this.toggleAlert()

        // After successful save, update user information
        this.userService.getUser(this.user.userId).subscribe({
          next: (updatedUser: any) => {
            this.user = updatedUser;
            // Update form fields with the latest data
            this.profileForm.controls['phoneNumber'].setValue(this.user.phoneNumber);
            this.profileForm.controls['address'].setValue(this.user.address);
            this.profileForm.controls['language'].setValue(this.user.language);
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => {
        console.error(err); // log the error to the console
        this.profileOnSaveError = err.message;
        this.toggleAlert()
      },
      complete: () => {
        this.profileForm.reset();
        this.isEditMode = false;
      }
    });
  }

  close() {
    this.profileForm.reset()
    this.profileForm.controls['phoneNumber'].setValue(this.user.phoneNumber)
    this.profileForm.controls['address'].setValue(this.user.address)
    this.profileForm.controls['language'].setValue(this.user.language)
    this.profileOnSaveError = ''
    this.profileOnSaveSuccess = ''
    this.isEditMode = false;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    // Store initial values when entering edit mode
    if (this.isEditMode) {
      this.initialUserPhone = this.user.phoneNumber;
      this.initialUserAddress = this.user.address;
      this.initialUserLanguage = this.user.language;
    }
  }

  // Check whether form values have been changed since opening the form.
  isFormDirty(): boolean {
    return (
      this.profileForm.controls['phoneNumber'].value !== this.initialUserPhone ||
      this.profileForm.controls['address'].value !== this.initialUserAddress ||
      this.profileForm.controls['language'].value !== this.initialUserLanguage
    );
  }

  // Readable Date
  formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleString('en-US')
  }

  // Show alert and automatically dismiss after 3 seconds
  toggleAlert() {
    this.isAlertVisible = true;

    setTimeout(() => {
      this.isAlertVisible = false;
    }, 3000);
  }
}
