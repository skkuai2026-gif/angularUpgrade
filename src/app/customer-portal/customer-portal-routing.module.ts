import { NgModule } from '@angular/core';
import { QuotationPolicyInsuranceStepFormComponent } from './quotation-policy-insurance-step-form/quotation-policy-insurance-step-form.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { CreatePolicyStepFormComponent } from './create-policy-step-form/create-policy-step-form.component';

const routes: Routes = [
  {
    path: 'customer-home',
    component: CreatePolicyStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'customer-home/:id',
    component: CreatePolicyStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-customer-policy/:id',
    component: CreatePolicyStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'create-customer-policy',
    component: CreatePolicyStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotation-policy-insurance/:id',
    component: QuotationPolicyInsuranceStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotation-policy-insurance',
    component: QuotationPolicyInsuranceStepFormComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class CustomerPortalRoutingModule {}
