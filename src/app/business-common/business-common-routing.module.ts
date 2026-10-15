import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponentComponent } from './user-profile-component/user-profile-component.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  {
    path: 'userprofile',
    component: UserProfileComponentComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessCommonRoutingModule {}
