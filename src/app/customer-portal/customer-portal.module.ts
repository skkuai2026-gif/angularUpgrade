import { CustomerPaymentSummaryComponent } from './customer-payment-summary/customer-payment-summary.component';
import { CustomerQuotationCoverageComponent } from './customer-quotation-coverage/customer-quotation-coverage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationService } from '../quotation/services/quotation.service';
import { PolicyService } from '../policy/services/policy.service';
import { SystemCommonModule } from '../system-common/system-common.module';
import { CreatePolicyStepFormComponent } from './create-policy-step-form/create-policy-step-form.component';
import { CustomerPortalRoutingModule } from './customer-portal-routing.module';
import { QuotationModule } from '../quotation/quotation.module';
import { PolicyModule } from '../policy/policy.module';
import { QuotationBasePlanSelectionComponent } from './quotation-base-plan-selection/quotation-base-plan-selection.component';
import { CustomerQuotationPartyComponent } from './customer-quotation-party/customer-quotation-party.component';
import { QuotationPolicyInsuranceStepFormComponent } from './quotation-policy-insurance-step-form/quotation-policy-insurance-step-form.component';

@NgModule({
  declarations: [
    CreatePolicyStepFormComponent,
    QuotationBasePlanSelectionComponent,
    CustomerQuotationCoverageComponent,
    CustomerPaymentSummaryComponent,
    CustomerQuotationPartyComponent,
    QuotationPolicyInsuranceStepFormComponent,
  ],
  imports: [CommonModule, SystemCommonModule, QuotationModule, PolicyModule, CustomerPortalRoutingModule],
  exports: [CreatePolicyStepFormComponent, CustomerPaymentSummaryComponent],
  providers: [QuotationService, PolicyService],
})
export class CustomerPortalModule {}
