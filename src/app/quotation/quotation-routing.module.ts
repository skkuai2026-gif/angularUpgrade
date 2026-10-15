import { QuotationHealthStepFormComponent } from './quotation-health-step-form/quotation-health-step-form.component';
import { QuotationHomeStepFormComponent } from './quotation-home-step-form/quotation-home-step-form.component';
import { QuotationTravelStepFormComponent } from './quotation-travel-step-form/quotation-travel-step-form.component';
import { QuotationComparisonComponent } from './quotation-comparison/quotation-comparison.component';
import { QuotationPreviewComponent } from './quotation-preview/quotation-preview.component';
import { AuthGuardService } from '../auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationSearchComponent } from './quotation-search/quotation-search.component';
import { QuoteInsuranceTypeSelectComponent } from './quote-insurance-type-select/quote-insurance-type-select.component';
import { QuotationTestApiStepFormComponent } from './quotation-test-api-step-form/quotation-test-api-step-form.component';
import { InforceIllustrationSearchComponent } from './inforce-illustration-search/inforce-illustration-search.component';
import { QuotationMainStepFormComponent } from './quotation-main-step-form/quotation-main-step-form.component';
import { QuickQuotationSearchComponent } from './quick-quotation-search/quick-quotation-search.component';

const routes: Routes = [
  {
    path: 'quotation/:id',
    component: QuotationMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'quotationHome/:id',
    component: QuotationHomeStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotation-comparison/:ids',
    component: QuotationComparisonComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotation',
    component: QuotationMainStepFormComponent,
    canActivate: [AuthGuardService],
    canDeactivate: [AuthGuardService],
  },
  {
    path: 'quotationHome',
    component: QuotationHomeStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotation-search',
    component: QuotationSearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quote-insurance-type',
    component: QuoteInsuranceTypeSelectComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotationTravel/:id',
    component: QuotationTravelStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotationTravel',
    component: QuotationTravelStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotationHealth/:id',
    component: QuotationHealthStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotationHealth',
    component: QuotationHealthStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quotationAPI',
    component: QuotationTestApiStepFormComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'inforce-illustration-search',
    component: InforceIllustrationSearchComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'inforce-illustration-search/:api',
    component: InforceIllustrationSearchComponent,
    canActivate: [AuthGuardService],
  },
  // {
  //   path: 'quotationInsurance/:id/:insuranceTypeCd',
  //   component: QuotationMainStepFormComponent,
  //   canActivate: [AuthGuardService],
  // },
  {
    path: 'quick-quotation-search',
    component: QuickQuotationSearchComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class QuotationRoutingModule {}
