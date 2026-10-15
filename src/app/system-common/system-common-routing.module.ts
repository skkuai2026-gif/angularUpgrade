import { LoginOtpComponent } from './login-otp/login-otp.component';
import { LanguageComponent } from './language/language.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuardService } from './../auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemSettingsComponent } from './system-settings/system-settings.component';

const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardService],
  },
  // {
  //   path: 'change-language',
  //   component: LanguageComponent,
  //   canActivate: [AuthGuardService],
  // },
  {
    path: 'symsettings',
    component: SystemSettingsComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'loginOtp', component: LoginOtpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class SystemCommonRoutingModule {}
