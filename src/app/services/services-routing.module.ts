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
import { InvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { roleGuard } from '../shared/role.guard';


const routes: Routes = [{
  path: '',
  component: ServicesComponent,
  children: [
    {
      path: 'service-repair',
      component: ServiceRepairComponent,
      title: 'BCRS: Service-Repair',
      canActivate: [authGuard]
    },
    {
      path: 'invoice-summary',
      component: InvoiceSummaryComponent,
      title: 'BCRS: Invoice Summary',
      canActivate: [authGuard]
    },
    {
      path: 'service-graph',
      component: ServiceGraphComponent,
      title: 'BCRS: Service-Graph',
      canActivate: [authGuard, roleGuard]
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }