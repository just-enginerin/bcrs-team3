/**
 * Title: register.component.ts
 * Author: Erin Brady
 * Date: 9/22/23
 * Description: Registration page logic
*/

import { Component, ElementRef, ViewChild } from '@angular/core';
import { SecurityService } from "./../security.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RegisterViewModel } from '../register-view-model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  // Stepper UI components

  // Stepper form stages
  @ViewChild('Form1', { static: false }) form1?: ElementRef;
  @ViewChild('Form2', { static: false }) form2?: ElementRef;
  @ViewChild('Form3', { static: false }) form3?: ElementRef;

  // Stepper Next Buttons
  @ViewChild('Next1', { static: false }) next1?: ElementRef;
  @ViewChild('Next2', { static: false }) next2?: ElementRef;

  // Stepper Back Buttons
  @ViewChild('Back1', { static: false }) back1?: ElementRef;
  @ViewChild('Back2', { static: false }) back2?: ElementRef;

  // Stepper dynamic text
  @ViewChild('Text1', { static: false }) text1?: ElementRef;
  @ViewChild('Text2', { static: false }) text2?: ElementRef;
  @ViewChild('Text3', { static: false }) text3?: ElementRef;

  //Stepper Progress bar
  @ViewChild('progress', { static: false }) progress?: ElementRef;

  // End of Stepper UI Components

  securityQuestions: string[]
  qArr1: string[]
  qArr2: string[]
  qArr3: string[]

  user: RegisterViewModel
  errorMessage: string
  isLoading: boolean = false

  // register form with validation
  registerForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])],
    confirmPassword: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])],
    phoneNumber: [''],
    address: [''],
    language: [''],
    question1: ['', Validators.compose([Validators.required])],
    answer1: ['', Validators.compose([Validators.required])],
    question2: ['', Validators.compose([Validators.required])],
    answer2: ['', Validators.compose([Validators.required])],
    question3: ['', Validators.compose([Validators.required])],
    answer3: ['', Validators.compose([Validators.required])],
  })

  // Stepper event handlers
  onNext1Click() {
    if (
      this.form1 &&
      this.form2 &&
      this.progress &&
      this.text2 &&
      this.registerForm.get('password')?.valid &&
      this.registerForm.get('confirmPassword')?.valid &&
      (this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value)
    ) {
      this.form1.nativeElement.style.left = '-450px';
      this.form2.nativeElement.style.left = '40px';
      this.progress.nativeElement.style.width = '240px';
      this.text2.nativeElement.style.color = 'white !important';
    }
  }

  onNext2Click() {
    if (this.form2 && this.form3 && this.progress && this.text3) {
      this.form2.nativeElement.style.left = '-450px';
      this.form3.nativeElement.style.left = '40px';
      this.progress.nativeElement.style.width = '360px';
      this.text3.nativeElement.style.color = 'white !important';
    }
  }

  onBack1Click() {
    if (this.form1 && this.form2 && this.progress && this.text2) {
      this.form2.nativeElement.style.left = '450px';
      this.form1.nativeElement.style.left = '40px';
      this.progress.nativeElement.style.width = '120px';
      this.text2.nativeElement.style.color = '#333';
    }
  }

  onBack2Click() {
    if (this.form2 && this.form3 && this.progress && this.text3) {
      this.form3.nativeElement.style.left = '450px';
      this.form2.nativeElement.style.left = '40px';
      this.progress.nativeElement.style.width = '240px';
      this.text3.nativeElement.style.color = '#333';
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private secService: SecurityService
  ) {

    this.securityQuestions = [
      "What is your mother's maiden name?",
      "What is the name of your first pet?",
      "What is the name of your childhood best friend?",
      "What is your favorite color?",
      "Which city were you born?",
      "What is your favorite song?"
    ]

    this.qArr1 = this.securityQuestions
    this.qArr2 = []
    this.qArr3 = []

    this.user = {} as RegisterViewModel

    this.errorMessage = ''
  }

  ngOnInit(): void {

    //subscribe to the value changes of Question 1
    this.registerForm.get('question1')?.valueChanges.subscribe(val => {
      console.log('Value from question 1: ', val)
      this.qArr2 = this.qArr1.filter(question => question !== val)
    })

    //subscribe to the value changes of Question 2
    this.registerForm.get('question2')?.valueChanges.subscribe(val => {
      console.log('Value from question 2: ', val)
      this.qArr3 = this.qArr2.filter(question => question !== val)
    })
  }

  // Handle the sign-in process
  register() {
    this.isLoading = true;

    console.log('Register Form:', this.registerForm.value)

    this.user = {
      firstName: this.registerForm.get('firstName')?.value || '',
      lastName: this.registerForm.get('lastName')?.value || '',
      email: this.registerForm.get('email')?.value || '',
      password: this.registerForm.get('password')?.value || '',
      phoneNumber: this.registerForm.get('phoneNumber')?.value || '',
      address: this.registerForm.get('address')?.value || '',
      language: this.registerForm.get('language')?.value || '',
      selectedSecurityQuestions: [
        {
          question: this.registerForm.get('question1')?.value || '',
          answer: this.registerForm.get('answer1')?.value || ''
        },
        {
          question: this.registerForm.get('question2')?.value || '',
          answer: this.registerForm.get('answer2')?.value || ''
        },
        {
          question: this.registerForm.get('question3')?.value || '',
          answer: this.registerForm.get('answer3')?.value || ''
        }
      ]
    }

    console.log('Registering the new user: ', this.user)

    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Please provide an email address and password'
      this.isLoading = false;
      return
    }

    // call the register function from the security service and subscribe to the result.
    this.secService.register(this.user).subscribe({
      next: (result) => {
        console.log('Result from Register API call: ', result)
        this.router.navigate(['/security/signin'])
      },
      error: (err) => {
        if (err.error.message) {
          console.log('db error: ', err.error.message)
          this.errorMessage = err.error.message
        } else {
          this.errorMessage = 'Something went wrong. Please contact the system administrator.'
          console.log(err)
        }
      }
    })


  }

}
