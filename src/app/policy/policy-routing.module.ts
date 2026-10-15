import { PolicyTestApiStepFormComponent } from './policy-test-api-step-form/policy-test-api-step-form.component';
import { AuthGuardService } from './../auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicySearchComponent } from './policy-search/policy-search.component';
import { PolicyInsuranceTypeSelectComponent } from './policy-insurance-type-select/policy-insurance-type-select.component';
import { PolicyCustomerStepFormComponent } from './policy-customer-step-form/policy-customer-step-form.component';
import { PolicyCustomerPaymentGatewayFormComponent } from './policy-customer-payment-gateway-form/policy-customer-payment-gateway-form.component';
import { TestRestApiComponent } from './test-rest-api/test-rest-api.component';
import { PolicyInforceIllustrationStepFormComponent } from './policy-inforce-illustration-step-form/policy-inforce-illustration-step-form.component';
import { PolicyMainStepFormComponent } from './policy-main-step-form/policy-main-step-form.component';
import { CopyPolicyDescStepFormComponent } from './copy-policy-desc-step-form/copy-policy-desc-step-form.component';
import { PolicyCustomerCompleteComponent } from './policy-customer-complete/policy-customer-complete.component';
import { PolicyLoginOtpRedirectComponent } from './policy-login-otp-redirect/policy-login-otp-redirect.component';
import { PolicyAcaPaymentGetwayFormViaEmailComponent } from './policy-aca-payment-getway-form-via-email/policy-aca-payment-getway-form-via-email.component';
import { PolicyPaymentGatewayEmailFormComponent } from './policy-payment-gateway-email-form/policy-payment-gateway-email-form.component';
const routes: Routes = [
  {
    path: 'policy/:id',
    component: PolicyMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'policy',
    component: PolicyMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'policy-search',
    component: PolicySearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-search/:api',
    component: PolicySearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-insurance-type',
    component: PolicyInsuranceTypeSelectComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-customer/:id',
    component: PolicyCustomerStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-customer',
    component: PolicyCustomerStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-customer-payment-gateway',
    component: PolicyCustomerPaymentGatewayFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-customer-payment-gateway/:id',
    component: PolicyCustomerPaymentGatewayFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policyAPI/:id',
    component: PolicyTestApiStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'restAPI-listing',
    component: TestRestApiComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'inforce-illustration',
    component: PolicyInforceIllustrationStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'copypolicy/:id',
    component: CopyPolicyDescStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-customer-complete',
    component: PolicyCustomerCompleteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'policy-login-otp-redirect',
    component: PolicyLoginOtpRedirectComponent,
  },
  {
    path: 'paymentViaEmail/:id',
    component: PolicyPaymentGatewayEmailFormComponent,
  },
  {
    path: 'acaViaEmail/:id',
    component: PolicyAcaPaymentGetwayFormViaEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class PolicyRoutingModule {}
