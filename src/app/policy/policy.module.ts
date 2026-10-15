import { PolicyTestApiStepFormComponent } from './policy-test-api-step-form/policy-test-api-step-form.component';
import { PolicyCustomerStepFormComponent } from './policy-customer-step-form/policy-customer-step-form.component';
import { PolicyTransferToCustomerComponent } from './policy-transfer-to-customer/policy-transfer-to-customer.component';
import { PolicyRiderExtraListComponent } from './policy-rider-extra-list/policy-rider-extra-list.component';
import { PayerPartyComponent } from './payer-party/payer-party.component';
import { PolicyDocumentImageComponent } from './policy-document-image/policy-document-image.component';
import { PolicyDocumentComponent } from './policy-document/policy-document.component';
import { PolicySupplementaryComponent } from './policy-supplementary/policy-supplementary.component';
import { PolicyJointLifeComponent } from './policy-joint-life/policy-joint-life.component';
import { PolicyPartyOtherIncomeComponent } from './policy-party-other-income/policy-party-other-income.component';
import { PolicyPartyEmploymentComponent } from './policy-party-employment/policy-party-employment.component';
import { PolicyPartyContactComponent } from './policy-party-contact/policy-party-contact.component';
import { PolicyPartyIdentityComponent } from './policy-party-identity/policy-party-identity.component';
import { PolicyPartyAddressComponent } from './policy-party-address/policy-party-address.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { PolicyRoutingModule } from './policy-routing.module';
import { PolicySearchComponent } from './policy-search/policy-search.component';
import { SystemCommonModule } from '../system-common/system-common.module';
import { PolicyStepFormComponent } from './policy-step-form/policy-step-form.component';
import { PolicyPartyDetailsComponent } from './policy-party-details/policy-party-details.component';
import { PolicyProposerComponent } from './policy-proposer/policy-proposer.component';
import { PolicyPrimaryInsuredComponent } from './policy-primary-insured/policy-primary-insured.component';
import { PolicyBasePlanComponent } from './policy-base-plan/policy-base-plan.component';
import { PolicyTopupComponent } from './policy-topup/policy-topup.component';
import { PolicyFundListComponent } from './policy-fund-list/policy-fund-list.component';
import { PolicyPlanExtraListComponent } from './policy-plan-extra-list/policy-plan-extra-list.component';
import { PolicyWithdrawalComponent } from './policy-withdrawal/policy-withdrawal.component';
import { PolicyInsuranceTypeSelectComponent } from './policy-insurance-type-select/policy-insurance-type-select.component';
import { PolicyBasicDetailComponent } from './policy-basic-detail/policy-basic-detail.component';
import { PolicyRiderComponent } from './policy-rider/policy-rider.component';
import { PolicyBeneficiaryComponent } from './policy-beneficiary/policy-beneficiary.component';
import { PolicyAgentSharingComponent } from './policy-agent-sharing/policy-agent-sharing.component';
import { PolicyInitialPaymentComponent } from './policy-initial-payment/policy-initial-payment.component';
import { PolicyRefundPaymentComponent } from './policy-refund-payment/policy-refund-payment.component';
import { PolicyRenewalPaymentComponent } from './policy-renewal-payment/policy-renewal-payment.component';
import { PolicyPartyQuestionnaireComponent } from './policy-party-questionnaire/policy-party-questionnaire.component';
import { PolicyQuestionSetComponent } from './policy-question-set/policy-question-set.component';
import { PolicyQuestionItemComponent } from './policy-question-item/policy-question-item.component';
import { PolicyAgentDeclarationComponent } from './policy-agent-declaration/policy-agent-declaration.component';
import { PolicypolicyEAppPreviewComponent } from './policy-e-app-preview/policy-e-app-preview.component';
import { PolicyPaymentComponent } from './policy-payment/policy-payment.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PolicyPartyNationalityDetailComponent } from './policy-party-nationality-detail/policy-party-nationality-detail.component';
import { PolicyPartyAddressTabsComponent } from './policy-party-address-tabs/policy-party-address-tabs.component';
import { PolicyPaymentSummaryComponent } from './policy-payment-summary/policy-payment-summary.component';

import { PolicyService } from './services/policy.service';
import { BusinessCommonModule } from '../business-common/business-common.module';
import { PolicyCustomerPaymentGatewayFormComponent } from './policy-customer-payment-gateway-form/policy-customer-payment-gateway-form.component';
import { PolicyUwResultComponent } from './policy-uw-result/policy-uw-result.component';
import { PolicyUwLoadingComponent } from './policy-uw-loading/policy-uw-loading.component';
import { QuotationModule } from '../quotation/quotation.module';
import { TestRestApiComponent } from './test-rest-api/test-rest-api.component';
import { PolicyInforceIllustrationStepFormComponent } from './policy-inforce-illustration-step-form/policy-inforce-illustration-step-form.component';
import { LeadModule } from '../lead/lead.module';
import { PolicyTransferHistoryComponent } from './policy-transfer-history/policy-transfer-history.component';
import { PolicyInsuranceStepFormComponent } from './policy-insurance-step-form/policy-insurance-step-form.component';
import { PolicyImgRecognitionComponent } from './policy-img-recognition/policy-img-recognition.component';
import { PolicyOutputPreferenceComponent } from './policy-output-preference/policy-output-preference.component';
import { PolicyQuoteIllustrationComponent } from './policy-quote-illustration/policy-quote-illustration.component';
import { PolicyMainStepFormComponent } from './policy-main-step-form/policy-main-step-form.component';
import { CopyPolicyComponent } from './copy-policy/copy-policy.component';
import { CopyPolicyDescStepFormComponent } from './copy-policy-desc-step-form/copy-policy-desc-step-form.component';
import { PolicyPaymentGatewayFormComponent } from './policy-payment-gateway-form/policy-payment-gateway-form.component';
import { PolicyDocumentFormComponent } from './policy-document-form/policy-document-form.component';
import { PolicyXmlQuestionSetComponent } from './policy-xml-question-set/policy-xml-question-set.component';
// import { TestComponent } from './test/test.component';
import { CSAModule } from '../csa/csa.module';
import { CSASLGFIModule } from '../csa-slgfi/csa-slgfi.module';
import { PolicyUwWritingComponent } from './policy-uw-underwriting/policy-uw-underwriting.component';
import { PolicyCustomerCompleteComponent } from './policy-customer-complete/policy-customer-complete.component';
import { PolicyCsaPreviewComponent } from './policy-csa-preview/policy-csa-preview.component';
import { PolicyMailingAddrContactComponent } from './policy-mailing-addr-contact/policy-mailing-addr-contact.component';
import { PolicyCustomerTransferHistoryComponent } from './policy-customer-transfer-history/policy-customer-transfer-history.component';
import { PolicyACAPaymentGatewayComponent } from './policy-aca-payment-gateway/policy-aca-payment-gateway.component';
import { PolicyEappFeedbackComponent } from './policy-eapp-feedback/policy-eapp-feedback.component';
import { PolicyEformsPreviewComponent } from './policy-eforms-preview/policy-eforms-preview.component';
import { PolicyAcaPaymentGetwayFormViaEmailComponent } from './policy-aca-payment-getway-form-via-email/policy-aca-payment-getway-form-via-email.component';
import { PolicyPaymentGatewayEmailFormComponent } from './policy-payment-gateway-email-form/policy-payment-gateway-email-form.component';
// import { PolicyACAPaymentGatewayComponent } from '../policy-aca-payment-gateway/policy-aca-payment-gateway.component';

@NgModule({
  declarations: [
    PolicySearchComponent,
    PolicyStepFormComponent,
    PolicyPartyDetailsComponent,
    PolicyProposerComponent,
    PolicyPrimaryInsuredComponent,
    PolicyBasePlanComponent,
    PolicyTopupComponent,
    PolicyFundListComponent,
    PolicyPlanExtraListComponent,
    PolicyWithdrawalComponent,
    PolicyInsuranceTypeSelectComponent,
    PolicyPartyAddressComponent,
    PolicyPartyIdentityComponent,
    PolicyPartyContactComponent,
    PolicyPartyEmploymentComponent,
    PolicyPartyOtherIncomeComponent,
    PolicyJointLifeComponent,
    PolicySupplementaryComponent,
    PolicyBasicDetailComponent,
    PolicyRiderComponent,
    PolicyBeneficiaryComponent,
    PolicyAgentSharingComponent,
    PolicyInitialPaymentComponent,
    PolicyRenewalPaymentComponent,
    PolicyRefundPaymentComponent,
    PolicyPartyQuestionnaireComponent,
    PolicyQuestionSetComponent,
    PolicyQuestionItemComponent,
    PolicyAgentDeclarationComponent,
    PolicyPaymentComponent,
    PolicypolicyEAppPreviewComponent,
    PolicyDocumentComponent,
    PolicyDocumentImageComponent,
    PayerPartyComponent,
    PolicyPartyNationalityDetailComponent,
    PolicyRiderExtraListComponent,
    PolicyPartyAddressTabsComponent,
    PolicyPaymentSummaryComponent,
    PolicyTransferToCustomerComponent,
    PolicyCustomerStepFormComponent,
    PolicyCustomerPaymentGatewayFormComponent,
    PolicyUwResultComponent,
    PolicyUwLoadingComponent,
    PolicyTestApiStepFormComponent,
    TestRestApiComponent,
    PolicyInforceIllustrationStepFormComponent,
    PolicyTransferHistoryComponent,
    PolicyInsuranceStepFormComponent,
    PolicyImgRecognitionComponent,
    PolicyOutputPreferenceComponent,
    PolicyQuoteIllustrationComponent,
    PolicyMainStepFormComponent,
    CopyPolicyComponent,
    CopyPolicyDescStepFormComponent,
    PolicyPaymentGatewayFormComponent,
    PolicyDocumentFormComponent,
    PolicyACAPaymentGatewayComponent,
    PolicyXmlQuestionSetComponent,
    // TestComponent,
    PolicyCsaPreviewComponent,
    PolicyMailingAddrContactComponent,
    PolicyUwWritingComponent,
    PolicyCustomerCompleteComponent,
    PolicyCustomerTransferHistoryComponent,
    PolicyEappFeedbackComponent,
    PolicyEformsPreviewComponent,
    PolicyPaymentGatewayEmailFormComponent,
    PolicyAcaPaymentGetwayFormViaEmailComponent,
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    SystemCommonModule,
    FormsModule,
    NgSelectModule,
    // ModalModule.forRoot(),
    BusinessCommonModule,
    QuotationModule,
    LeadModule,
    CSAModule,
    CSASLGFIModule,
  ],
  exports: [
    PolicyPartyAddressComponent,
    PolicyPartyEmploymentComponent,
    PolicyPartyAddressTabsComponent,
    PolicyPartyQuestionnaireComponent,
    PolicyQuestionSetComponent,
    PolicyQuestionItemComponent,
    PolicyDocumentComponent,
    PolicyDocumentImageComponent,
    PolicyPaymentSummaryComponent,
    PolicyTestApiStepFormComponent,
    PolicyCsaPreviewComponent,
    PolicyMailingAddrContactComponent,
    PolicyCustomerCompleteComponent,
  ],
  providers: [PolicyService],
})
export class PolicyModule {}
