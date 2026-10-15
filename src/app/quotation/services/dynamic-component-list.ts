import { IndustryOccupationComponent } from 'src/app/business-common/industry-occupation/industry-occupation.component';
import { FundListComponent } from '../fund-list/fund-list.component';
import { PremiumSummaryComponent } from '../premium-summary/premium-summary.component';
import { ProductSelectionComponent } from '../product-selection/product-selection.component';
import { ProposerComponent } from '../proposer/proposer.component';
import { QuotationPartyComponent } from '../quotation-party/quotation-party.component';
import { QuotationRiderCardComponent } from '../quotation-rider-card/quotation-rider-card.component';
import { RiderComponent } from '../rider/rider.component';
import { SupplementaryComponent } from '../supplementary/supplementary.component';
import { WithdrawalComponent } from '../withdrawal/withdrawal.component';
import { PrimaryInsuredComponent } from '../primary-insured/primary-insured.component';
import { JointLifeComponent } from '../joint-life/joint-life.component';
import { QuoteIllustrationComponent } from '../quote-illustration/quote-illustration.component';
import { BasePlanOtherComponent } from '../base-plan-other/base-plan-other.component';
import { TopupComponent } from '../topup/topup.component';
import { PlanExtraListComponent } from '../plan-extra-list/plan-extra-list.component';
import { QuotationParentComboProductCoverageComponent } from '../quotation-parent-combo-product-coverage/quotation-parent-combo-product-coverage.component';
import { CoverageSummaryComponent } from '../coverage-summary/coverage-summary.component';
import { BasePlanComponent } from '../base-plan/base-plan.component';
import { NavigationLinksComponent } from 'src/app/system-common/navigation-links/navigation-links.component';
import { SignatureComponent } from 'src/app/system-common/signature/signature.component';
import { QuotationPartyAddressComponent } from '../quotation-party-address/quotation-party-address.component';
import { LinkSearchInsuredComponent } from '../link-search-insured/link-search-insured.component';
import { CSAPreviewComponent } from 'src/app/csa/csa-preview/csa-preview.component';

export class DynamicComponentList {
  static componentMap = {
    'sym-product-selection': ProductSelectionComponent,
    'sym-premium-summary': PremiumSummaryComponent,
    'sym-quotation-rider-card': QuotationRiderCardComponent,
    'sym-rider': RiderComponent,
    'sym-quotation-party': QuotationPartyComponent,
    'sym-withdrawal': WithdrawalComponent,
    'sym-supplementary': SupplementaryComponent,
    'sym-fund-list': FundListComponent,
    'sym-proposer': ProposerComponent,
    'sym-industry-occupation': IndustryOccupationComponent,
    'sym-primary-insured': PrimaryInsuredComponent,
    'sym-joint-life': JointLifeComponent,
    'sym-quote-illustration': QuoteIllustrationComponent,
    'sym-base-plan-other': BasePlanOtherComponent,
    'sym-link-search-insured': LinkSearchInsuredComponent,
    'sym-topup': TopupComponent,
    'sym-csa-preview': CSAPreviewComponent,
    'sym-plan-extra-list': PlanExtraListComponent,
    'sym-quotation-parent-combo-product-coverage': QuotationParentComboProductCoverageComponent,
    'sym-coverage-summary': CoverageSummaryComponent,
    'sym-base-plan': BasePlanComponent,
    'sym-navigation-links': NavigationLinksComponent,
    'sym-quotation-party-address': QuotationPartyAddressComponent,
  };
}
