import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';
// import {default as data} from '../../assets/config/url-config.json';
import { OktaRoutingModule } from './okta-routing.module';
import { OktaLoginComponent } from './okta-login/okta-login.component';
import { OktaLoginCallbackComponent } from './okta-login-callback/okta-login-callback.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { SystemCommonModule } from '../system-common/system-common.module';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { SunPhLoginModule } from '../sun-ph-login/sun-ph-login.module';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyStatementComponent } from './privacy-statement/privacy-statement.component';
import { OfflineLoginWithPinComponent } from './offline-login-with-pin/offline-login-with-pin.component';
import { OktaOfflineRegisterPinComponent } from './okta-offline-register-pin/okta-offline-register-pin.component';
import * as config from 'src/assets/config/url-config.json';
import { PaymentResponseEmailComponent } from './payment-response-email/payment-response-email.component';
import { PaymentResponseAcaEmailComponent } from './payment-response-aca-email/payment-response-aca-email.component';

export function oktaConfiguration() {
  let url = config;
  let data = url[1];
  const oktaAuth = new OktaAuth({
    issuer: data.oidc.issuer,
    clientId: data.oidc.clientId,
    redirectUri: self.origin + data.oidc.redirectUri,
    postLogoutRedirectUri: self.origin + data.oidc.postLogoutRedirectUri,
    scopes: data.oidc.scopes,
  });
  return { oktaAuth };
}
@NgModule({
  declarations: [
    LoginRedirectComponent,
    PaymentResponseComponent,
    OktaLoginComponent,
    OktaLoginCallbackComponent,
    TermsAndConditionsComponent,
    PrivacyStatementComponent,
    OfflineLoginWithPinComponent,
    OktaOfflineRegisterPinComponent,
    PaymentResponseEmailComponent,
    PaymentResponseAcaEmailComponent,
  ],
  imports: [CommonModule, FormsModule, SystemCommonModule, OktaRoutingModule, OktaAuthModule, SunPhLoginModule],
  exports: [
    LoginRedirectComponent,
    PaymentResponseComponent,
    TermsAndConditionsComponent,
    PrivacyStatementComponent,
    OktaLoginComponent,
    OktaLoginCallbackComponent,
    OktaRoutingModule,
    OktaOfflineRegisterPinComponent,
    OfflineLoginWithPinComponent,
  ],
  providers: [
    {
      provide: OKTA_CONFIG,
      useFactory: oktaConfiguration,
      multi: false,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OktaModule {}
