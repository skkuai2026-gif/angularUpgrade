import { QuotationHealthStepFormComponent } from './quotation-health-step-form/quotation-health-step-form.component';
import { QuotationRiderCardComponent } from './quotation-rider-card/quotation-rider-card.component';
import { QuotationTravelStepFormComponent } from './quotation-travel-step-form/quotation-travel-step-form.component';
import { QuotationHomeStepFormComponent } from './quotation-home-step-form/quotation-home-step-form.component';
import { QuotationTestApiStepFormComponent } from './quotation-test-api-step-form/quotation-test-api-step-form.component';
import { QuotationComparisonComponent } from './quotation-comparison/quotation-comparison.component';
import { QuotationPreviewComponent } from './quotation-preview/quotation-preview.component';
import { BusinessCommonModule } from './../business-common/business-common.module';
import { OccupationIndustryDutySearchComponent } from '../business-common/occupation-industry-duty-search/occupation-industry-duty-search.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailRequestComponent } from './email-request/email-request.component';
import { QuoteIllustrationComponent } from './quote-illustration/quote-illustration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationStepFormComponent } from './quotation-step-form/quotation-step-form.component';
import { BasePlanComponent } from './base-plan/base-plan.component';
import { ProposerComponent } from './proposer/proposer.component';
import { BasicDetailComponent } from './basic-detail/basic-detail.component';
import { PrimaryInsuredComponent } from './primary-insured/primary-insured.component';
import { SystemCommonModule } from '../system-common/system-common.module';
import { QuotationService } from './services/quotation.service';
import { QuotationSearchComponent } from './quotation-search/quotation-search.component';
import { RiderComponent } from './rider/rider.component';
import { FundListComponent } from './fund-list/fund-list.component';
import { JointLifeComponent } from './joint-life/joint-life.component';
import { PlanExtraListComponent } from './plan-extra-list/plan-extra-list.component';
import { RiderExtraListComponent } from './rider-extra-list/rider-extra-list.component';
import { SupplementaryComponent } from './supplementary/supplementary.component';
import { TopupComponent } from './topup/topup.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { QuotationPartyComponent } from './quotation-party/quotation-party.component';
import { ProductSelectionComponent } from './product-selection/product-selection.component';
import { QuoteInsuranceTypeSelectComponent } from './quote-insurance-type-select/quote-insurance-type-select.component';
import { PremiumSummaryComponent } from './premium-summary/premium-summary.component';
import { OutputPreferencesComponent } from './output-preferences/output-preferences.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CoverageSummaryComponent } from './coverage-summary/coverage-summary.component';
// import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { BasePlanOtherComponent } from './base-plan-other/base-plan-other.component';
import { QuotationPartyHandlerComponent } from './quotation-party/quotation-party.handler';
import { QuotationParentComboProductCoverageComponent } from './quotation-parent-combo-product-coverage/quotation-parent-combo-product-coverage.component';
import { QuotationChildComboProductCoverageComponent } from './quotation-child-combo-product-coverage/quotation-child-combo-product-coverage.component';
import { CustomFormatPipe } from '../system-common/pipe/custom-format.pipe';
import { InforceIllustrationSearchComponent } from './inforce-illustration-search/inforce-illustration-search.component';
// import { ChartsModule } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { QuotationInsuranceStepFormComponent } from './quotation-insurance-step-form/quotation-insurance-step-form.component';
import { ComboPremiumSummaryComponent } from './combo-premium-summary/combo-premium-summary.component';
import { ComboPremiumSummaryDetailsComponent } from './combo-premium-summary-details/combo-premium-summary-details.component';
import { QuotationMainStepFormComponent } from './quotation-main-step-form/quotation-main-step-form.component';
import { QuotationPartyAddressComponent } from './quotation-party-address/quotation-party-address.component';
import { LinkSearchInsuredComponent } from './link-search-insured/link-search-insured.component';
import { CSALinkProposalComponent } from './csa-link-proposal/csa-link-proposal.component';
import { ProductSelectionFilterPipe } from './product-selection/pipe/product-selection.pipe';
import { LifePremiumSummaryComponent } from './life-premium-summary/life-premium-summary.component';
import { QuoteIllustrationChartComponent } from './quote-illustration-chart/quote-illustration-chart.component';
import { QuickQuotationSearchComponent } from './quick-quotation-search/quick-quotation-search.component';
@NgModule({
  declarations: [
    QuotationStepFormComponent,
    QuotationTestApiStepFormComponent,
    BasePlanComponent,
    BasePlanOtherComponent,
    ProposerComponent,
    BasicDetailComponent,
    PrimaryInsuredComponent,
    QuotationSearchComponent,
    RiderComponent,
    FundListComponent,
    JointLifeComponent,
    PlanExtraListComponent,
    RiderExtraListComponent,
    SupplementaryComponent,
    TopupComponent,
    WithdrawalComponent,
    QuotationPartyComponent,
    ProductSelectionComponent,
    ProductSelectionFilterPipe,
    PremiumSummaryComponent,
    OutputPreferencesComponent,
    EmailRequestComponent,
    QuoteIllustrationComponent,
    QuoteInsuranceTypeSelectComponent,
    CoverageSummaryComponent,
    QuotationPreviewComponent,
    QuotationComparisonComponent,
    QuotationHomeStepFormComponent,
    LinkSearchInsuredComponent,
    QuotationTravelStepFormComponent,
    QuotationRiderCardComponent,
    QuotationPartyHandlerComponent,
    QuotationParentComboProductCoverageComponent,
    QuotationChildComboProductCoverageComponent,
    QuotationHealthStepFormComponent,
    InforceIllustrationSearchComponent,
    QuotationInsuranceStepFormComponent,
    ComboPremiumSummaryComponent,
    ComboPremiumSummaryDetailsComponent,
    QuotationMainStepFormComponent,
    QuotationPartyAddressComponent,
    CSALinkProposalComponent,
    LifePremiumSummaryComponent,
    QuoteIllustrationChartComponent,
    QuickQuotationSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SystemCommonModule,
    QuotationRoutingModule,
    // ModalModule.forRoot(),
    BusinessCommonModule,
    // ChartsModule,
  ],
  exports: [
    ProductSelectionComponent,
    ProductSelectionFilterPipe,
    BasePlanComponent,
    QuotationRiderCardComponent,
    PremiumSummaryComponent,
    FundListComponent,
    RiderComponent,
    LinkSearchInsuredComponent,
    QuotationPartyHandlerComponent,
    QuoteIllustrationComponent,
    QuotationTestApiStepFormComponent,
    QuotationPreviewComponent,
    RiderComponent,
    RiderExtraListComponent,
  ],
  providers: [QuotationService, CustomFormatPipe],
})
export class QuotationModule {}
