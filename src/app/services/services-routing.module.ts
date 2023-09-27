/**
 * Title: service-routing.module.ts
 * Author: Professor Krasso
 * Date: 9/25/23
 * Updated by: Yakut Ahmedin
*/

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services.component';
import { ServiceRepairComponent } from './service-repair/service-repair.component';
import { ServiceGraphComponent } from './service-graph/service-graph.component';
import { authGuard } from '../shared/auth.guard';


const routes: Routes = [{
  path: '',
  component: ServicesComponent,
  children: [
    {
      path: 'service-repair',
      component: ServiceRepairComponent,
      title: 'Bcrs-team3: Service-Repair'
    },
    {
      path: 'service-graph',
      component: ServiceGraphComponent,
      title: 'Bcrs-team3: Service-Graph'
    }
  ],
  canActivate: [authGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
