/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { UserNewComponent } from './users/user-new/user-new.component';
import { roleGuard } from '../shared/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
        title: 'Bcrs-team3: Users'
      },
      {
        path: 'users/:userId/view',
        component: UserViewComponent,
        title: 'Bcrs-team3: User'
      },
      {
        path: 'users/new',
        component: UserNewComponent,
        title: 'Bcrs-team3: New User'
      }
    ],
    canActivate: [roleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
