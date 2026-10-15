import { BankInsuranceTypeSelectComponent } from './bank-insurance-type-select/bank-insurance-type-select.component';
import { BankStepFormComponent } from './bank-step-form/bank-step-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  {
    path: 'bank-home',
    component: BankInsuranceTypeSelectComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'bank-entry',
    component: BankStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'bank-entry/:id',
    component: BankStepFormComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class BankPortalRoutingModule {}
