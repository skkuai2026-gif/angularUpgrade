import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { FnaStepFormComponent } from './fna-step-form/fna-step-form.component';

const routes: Routes = [
  {
    path: 'fna',
    component: FnaStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'fna/:id',
    component: FnaStepFormComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FNARoutingModule {}
