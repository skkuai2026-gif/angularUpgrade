import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SunPhLoginOtpComponent } from './sun-ph-login-otp/sun-ph-login-otp.component';

const routes: Routes = [{ path: 'loginOTPPH', component: SunPhLoginOtpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SunPhLoginRoutingModule {}
