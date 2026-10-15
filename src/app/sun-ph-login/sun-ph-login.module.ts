import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SunPhLoginRoutingModule } from './sun-ph-login-routing.module';
import { SunPhLoginComponent } from './sun-ph-login.component';
import { CommonLoginService } from './service/common-login.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemCommonModule } from '../system-common/system-common.module';
import { TransferCustomerOtpComponent } from './transfer-customer-otp/transfer-customer-otp.component';
import { SunPhLoginOtpComponent } from './sun-ph-login-otp/sun-ph-login-otp.component';

@NgModule({
  declarations: [SunPhLoginComponent, TransferCustomerOtpComponent, SunPhLoginOtpComponent],
  imports: [CommonModule, SystemCommonModule, ReactiveFormsModule, FormsModule],
  exports: [SunPhLoginComponent, TransferCustomerOtpComponent, SunPhLoginOtpComponent],
  providers: [CommonLoginService],
})
export class SunPhLoginModule {}
