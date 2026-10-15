import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { CSASLGFISearchComponent } from './csa-slgfi-search-form/csa-slgfi-search-form.component';
import { CSASLGFIStepFormComponent } from './csa-slgfi-step-form/csa-slgfi-step-form.component';

const routes: Routes = [
  {
    path: 'csa-slgfi-search',
    component: CSASLGFISearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'csa-slgfi',
    component: CSASLGFIStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'csa-slgfi/:id',
    component: CSASLGFIStepFormComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CSASLGFIRoutingModule {}
