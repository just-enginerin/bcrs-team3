/**
 * Title: services.module.ts
 * Author: Professor Krasso
 * Date: 9/25/23
 * Updated by: Yakut Ahmedin
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServicesRoutingModule } from './services-routing.module';
import { ServiceRepairComponent } from './service-repair/service-repair.component';
import { ServicesComponent } from './services.component';
import { ServiceGraphComponent } from './service-graph/service-graph.component';


@NgModule({
  declarations: [
    ServiceRepairComponent,
    ServicesComponent,
    ServiceGraphComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ServicesModule { }
