import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SunSmartAppComponent } from './sunsmart-app/sunsmart-app.component';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuardService] },
  {
    path: 'GetRedemptionCode',
    component: SunSmartAppComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
