/**
 * Title: admin.module.ts
 * Author: Yakut Ahmedin
 * Date: 9/15/23
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { UserListComponent } from './users/user-list/user-list.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserNewComponent,
    UserViewComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})

export class AdminModule { }
