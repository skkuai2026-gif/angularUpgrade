import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { SunPhLoginOtpComponent } from '../sun-ph-login/sun-ph-login-otp/sun-ph-login-otp.component';
import { TransferCustomerOtpComponent } from '../sun-ph-login/transfer-customer-otp/transfer-customer-otp.component';
import { OktaLoginCallbackComponent } from './okta-login-callback/okta-login-callback.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { OfflineLoginWithPinComponent } from './offline-login-with-pin/offline-login-with-pin.component';
import { OktaOfflineRegisterPinComponent } from './okta-offline-register-pin/okta-offline-register-pin.component';
import { PaymentResponseAcaEmailComponent } from './payment-response-aca-email/payment-response-aca-email.component';

const routes: Routes = [
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'oktacallback', component: OktaLoginCallbackComponent, canActivate: [OktaAuthGuard] },
  { path: 'paymentResponse', component: PaymentResponseComponent },
  { path: 'acaResponseEmail', component: PaymentResponseAcaEmailComponent },
  { path: 'TermsAndConditions', component: TermsAndConditionsComponent },
  { path: 'PrivacyStatement', component: PrivacyStatementComponent },
  { path: 'loginOTPPH', component: SunPhLoginOtpComponent },
  { path: 'oktaOfflineRegisterPin', component: OktaOfflineRegisterPinComponent },
  { path: 'offlineLoginWithPin', component: OfflineLoginWithPinComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class OktaRoutingModule {}
