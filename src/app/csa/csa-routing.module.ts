import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { CSAStepFormComponent } from './csa-step-form/csa-step-form.component';
import { CSASearchComponent } from './csa-search-form/csa-search-form.component';

const routes: Routes = [
  {
    path: 'csa-search',
    component: CSASearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'csa',
    component: CSAStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'csa/:id',
    component: CSAStepFormComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CSARoutingModule {}
