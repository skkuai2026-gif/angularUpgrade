import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth-guard.service';
import { TestRestApiComponent } from '../policy/test-rest-api/test-rest-api.component';
import { LeadSearchComponent } from './lead-search/lead-search.component';
import { LeadStepFormComponent } from './lead-step-form/lead-step-form.component';
import { LeadTestAPIStepFormHandlerComponent } from './lead-test-api-step-form/lead-test-api-step-form.component';
import { LeadInsuranceStepFormComponent } from './lead-insurance-step-form/lead-insurance-step-form.component';
import { LeadMainStepFormComponent } from './lead-main-step-form/lead-main-step-form.component';
import { LeadSearchDownloadComponent } from './lead-search-download/lead-search-download.component';

const routes: Routes = [
  {
    path: 'lead-download',
    component: LeadSearchDownloadComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lead-search',
    component: LeadSearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lead',
    component: LeadMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'lead/:id',
    component: LeadMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'leadAPI/:id',
    component: LeadTestAPIStepFormHandlerComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class LeadRoutingModule {}
