import { BankPortalModule } from './bank-portal/bank-portal.module';
/**Angular Imports */
import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
// import { SignaturePadModule } from 'angular2-signaturepad';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
// import { ChartModule } from 'angular-highcharts';
// import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';
registerLocaleData(localeIn);

// Datepicker module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';

/**App-Module imports */
import { SystemCommonModule } from './system-common/system-common.module';
import { HomeModule } from './home/home.module';
import { OfflineModule } from './offline/offline.module';
import { QuotationModule } from './quotation/quotation.module';
import { PolicyModule } from './policy/policy.module';
import { LeadModule } from './lead/lead.module';
import { FNAModule } from './fna/fna.module';
import { CollateralModule } from './collateral/collateral.module';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.modules';
import DatePicker from '@ui5/webcomponents/dist/DatePicker.js';
import DateTimePicker from '@ui5/webcomponents/dist/DateTimePicker.js';
/**
 * Service Import
 */
import { SettingService } from './system-common/services/setting.service';
import { CollateralProductModule } from './collateral-product/collateral-product.module';
import { RouteReuseStrategy } from '@angular/router';
import { RouteConfig } from './system-common/route-config/route-config';
import { CSARoutingModule } from './csa/csa-routing.module';
import { CSAModule } from './csa/csa.module';
import { CSASLGFIModule } from './csa-slgfi/csa-slgfi.module';
import { OktaModule } from './okta/okta.module';
import { SunPhLoginModule } from './sun-ph-login/sun-ph-login.module';
import { OKTA_CONFIG, OktaAuthConfigService, OktaAuthModule, OktaConfig } from '@okta/okta-angular';
import OktaAuth, { OktaAuthOptions } from '@okta/okta-auth-js';
import { map, take, tap } from 'rxjs/operators';

export function init_app(appLoadService: SettingService) {
  return () => appLoadService.init();
}
// function onAppInit(): () => Promise<any> {
//   return (): Promise<any> => {
//     DateTimePicker.define();
//     return DatePicker.define();
//   };
// }
const oktaAuth = new OktaAuth({
  issuer: 'https://integrator-9002086.okta.com/oauth2/default/',
  clientId: '0oazgn52ftD99rh8X697',
  redirectUri: self.origin + '/login/callback',

  postLogoutRedirectUri: self.origin + '/login',
  tokenManager: {
    autoRenew: true,
  },
});
const moduleConfig: OktaConfig = { oktaAuth };

@NgModule({
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    NgSelectModule,
    // SignaturePadModule,
    AngularSignaturePadModule,
    // ChartsModule,
    // ChartModule,
    DataTablesModule,
    SystemCommonModule,
    HomeModule,
    OktaModule,
    OfflineModule,
    QuotationModule,
    PolicyModule,
    LeadModule,
    FNAModule,
    CollateralModule,
    CustomerPortalModule,
    BankPortalModule,
    CollateralProductModule,
    CSAModule,
    CSASLGFIModule,
    SunPhLoginModule,
    OktaModule,
    OktaAuthModule,
    AppRoutingModule,
    OktaAuthModule.forRoot(moduleConfig),
  ],
  providers: [
    {
      provide: OKTA_CONFIG,
      useValue: { oktaAuth },
    },
    SettingService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [SettingService],
      multi: true,
    },
    AuthService,
    { provide: String, useValue: 'dummy' },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: onAppInit,
    //   multi: true,
    // },
    { provide: RouteReuseStrategy, useClass: RouteConfig },
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
})
export class AppModule {}
