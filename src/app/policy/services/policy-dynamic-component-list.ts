import { SignatureUIComponent } from './../../system-common/signatureUI/signatureUI.component';
import { PolicyAgentDeclarationComponent } from 'src/app/policy/policy-agent-declaration/policy-agent-declaration.component';
import { PolicyAgentSharingComponent } from 'src/app/policy/policy-agent-sharing/policy-agent-sharing.component';
import { PolicyBasePlanComponent } from 'src/app/policy/policy-base-plan/policy-base-plan.component';
import { PolicyBasicDetailComponent } from 'src/app/policy/policy-basic-detail/policy-basic-detail.component';
import { PolicyBeneficiaryComponent } from 'src/app/policy/policy-beneficiary/policy-beneficiary.component';
import { PolicyDocumentComponent } from 'src/app/policy/policy-document/policy-document.component';
import { PolicypolicyEAppPreviewComponent } from 'src/app/policy/policy-e-app-preview/policy-e-app-preview.component';
import { PolicyFundListComponent } from 'src/app/policy/policy-fund-list/policy-fund-list.component';
import { PolicyJointLifeComponent } from 'src/app/policy/policy-joint-life/policy-joint-life.component';
import { PolicyPartyAddressTabsComponent } from 'src/app/policy/policy-party-address-tabs/policy-party-address-tabs.component';
import { PolicyPartyContactComponent } from 'src/app/policy/policy-party-contact/policy-party-contact.component';
import { PolicyPartyDetailsComponent } from 'src/app/policy/policy-party-details/policy-party-details.component';
import { PolicyPartyEmploymentComponent } from 'src/app/policy/policy-party-employment/policy-party-employment.component';
import { PolicyPartyIdentityComponent } from 'src/app/policy/policy-party-identity/policy-party-identity.component';
import { PolicyPartyNationalityDetailComponent } from 'src/app/policy/policy-party-nationality-detail/policy-party-nationality-detail.component';
import { PolicyPartyOtherIncomeComponent } from 'src/app/policy/policy-party-other-income/policy-party-other-income.component';
import { PolicyPartyQuestionnaireComponent } from 'src/app/policy/policy-party-questionnaire/policy-party-questionnaire.component';
import { PolicyPaymentSummaryComponent } from 'src/app/policy/policy-payment-summary/policy-payment-summary.component';
import { PolicyPaymentComponent } from 'src/app/policy/policy-payment/policy-payment.component';
import { PolicyPlanExtraListComponent } from 'src/app/policy/policy-plan-extra-list/policy-plan-extra-list.component';
import { PolicyPrimaryInsuredComponent } from 'src/app/policy/policy-primary-insured/policy-primary-insured.component';
import { PolicyProposerComponent } from 'src/app/policy/policy-proposer/policy-proposer.component';
import { PolicyRiderComponent } from 'src/app/policy/policy-rider/policy-rider.component';
import { PolicySupplementaryComponent } from 'src/app/policy/policy-supplementary/policy-supplementary.component';
import { PolicyTopupComponent } from 'src/app/policy/policy-topup/policy-topup.component';
import { PolicyUwResultComponent } from 'src/app/policy/policy-uw-result/policy-uw-result.component';
import { SignatureComponent } from 'src/app/system-common/signature/signature.component';
import { PolicyQuoteIllustrationComponent } from '../policy-quote-illustration/policy-quote-illustration.component';
import { CSAPreviewComponent } from 'src/app/csa/csa-preview/csa-preview.component';
import { PolicyCsaPreviewComponent } from '../policy-csa-preview/policy-csa-preview.component';
import { PolicyUwWritingComponent } from '../policy-uw-underwriting/policy-uw-underwriting.component';
import { PolicyPaymentGatewayFormComponent } from '../policy-payment-gateway-form/policy-payment-gateway-form.component';
import { PolicyDocumentFormComponent } from '../policy-document-form/policy-document-form.component';
import { PolicyACAPaymentGatewayComponent } from '../policy-aca-payment-gateway/policy-aca-payment-gateway.component';
import { PolicyEappFeedbackComponent } from '../policy-eapp-feedback/policy-eapp-feedback.component';
import { PolicyEformsPreviewComponent } from '../policy-eforms-preview/policy-eforms-preview.component';

export class PolicyDynamicComponentList {
  static componentMap = {
    'sym-policy-basic-detail': PolicyBasicDetailComponent,
    'sym-policy-base-plan': PolicyBasePlanComponent,
    'sym-policy-rider': PolicyRiderComponent,
    'sym-policy-fund-list': PolicyFundListComponent,
    'sym-policy-plan-extra-list': PolicyPlanExtraListComponent,
    'sym-policy-topup': PolicyTopupComponent,
    'sym-policy-proposer': PolicyProposerComponent,
    'sym-policy-party-details': PolicyPartyDetailsComponent,
    'sym-policy-party-address-tabs': PolicyPartyAddressTabsComponent,
    'sym-policy-party-contact': PolicyPartyContactComponent,
    'sym-policy-party-identity': PolicyPartyIdentityComponent,
    'sym-policy-party-other-income': PolicyPartyOtherIncomeComponent,
    'sym-policy-party-employment': PolicyPartyEmploymentComponent,
    'sym-policy-party-nationality-detail': PolicyPartyNationalityDetailComponent,
    'sym-policy-primary-insured': PolicyPrimaryInsuredComponent,
    'sym-policy-joint-life': PolicyJointLifeComponent,
    'sym-policy-supplementary': PolicySupplementaryComponent,
    'sym-policy-beneficiary': PolicyBeneficiaryComponent,
    'sym-csa-preview': CSAPreviewComponent,
    'sym-policy-payment': PolicyPaymentComponent,
    'sym-policy-document': PolicyDocumentComponent,
    'sym-policy-e-app-preview': PolicypolicyEAppPreviewComponent,
    'sym-policy-csa-preview': PolicyCsaPreviewComponent,
    'sym-policy-payment-summary': PolicyPaymentSummaryComponent,
    'sym-policy-agent-sharing': PolicyAgentSharingComponent,
    'sym-policy-agent-declaration': PolicyAgentDeclarationComponent,
    'sym-policy-uw-result': PolicyUwResultComponent,
    'sym-policy-party-questionnaire': PolicyPartyQuestionnaireComponent,
    'sym-signature': SignatureComponent,
    'sym-policy-quote-illustration': PolicyQuoteIllustrationComponent,
    'sym-signatureUI': SignatureUIComponent,
    'sym-policy-uw-underwriting': PolicyUwWritingComponent,
    'sym-policy-payment-gateway-form': PolicyPaymentGatewayFormComponent,
    'sym-policy-document-form': PolicyDocumentFormComponent,
    'sym-policy-aca-payment-gateway': PolicyACAPaymentGatewayComponent,
    'sym-policy-eapp-feedback': PolicyEappFeedbackComponent,
    'sym-policy-eforms-preview': PolicyEformsPreviewComponent,
  };
}
