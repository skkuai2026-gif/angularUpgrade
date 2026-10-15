import { LeadPartyDetailsComponent } from './lead-party-details/lead-party-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LeadRoutingModule } from './lead-routing.module';
import { SystemCommonModule } from '../system-common/system-common.module';
import { LeadSearchComponent } from './lead-search/lead-search.component';
import { LeadStepFormComponent } from './lead-step-form/lead-step-form.component';
import { LeadBasicComponent } from './lead-basic/lead-basic.component';
import { LeadActivityComponent } from './lead-activity/lead-activity.component';
import { LeadPartyAddressTabsComponent } from './lead-party-address-tabs/lead-party-address-tabs.component';
import { LeadPartyContactComponent } from './lead-party-contact/lead-party-contact.component';

import { LeadPartyIdentityComponent } from './lead-party-identity/lead-party-identity.component';
import { LeadPartyNationalityDetailComponent } from './lead-party-nationality-detail/lead-party-nationality-detail.component';
import { LeadPartyOtherIncomeComponent } from './lead-party-other-income/lead-party-other-income.component';
import { LeadPartyEmploymentComponent } from './lead-party-employment/lead-party-employment.component';
import { LeadPartyAddressComponent } from './lead-party-address/lead-party-address.component';
import { LeadTestAPIStepFormHandlerComponent } from './lead-test-api-step-form/lead-test-api-step-form.component';

import { BusinessCommonModule } from '../business-common/business-common.module';
import { LeadService } from './services/lead.service';
import { LeadInsuranceStepFormComponent } from './lead-insurance-step-form/lead-insurance-step-form.component';
import { LeadMainStepFormComponent } from './lead-main-step-form/lead-main-step-form.component';
import { LeadOutputPreferenceComponent } from './lead-output-preference/lead-output-preference.component';
import { ViewCSAListComponent } from './view-csa-list/view-csa-list.component';
import { ViewProposalListLeadComponent } from './view-proposal-list-lead/view-proposal-list-lead.component';
import { ViewPolicyListComponent } from './view-policy-list/view-policy-list.component';
import { LeadSearchDownloadComponent } from './lead-search-download/lead-search-download.component';

@NgModule({
  declarations: [
    LeadSearchComponent,
    LeadStepFormComponent,
    LeadBasicComponent,
    ViewCSAListComponent,
    ViewProposalListLeadComponent,
    LeadActivityComponent,
    LeadPartyDetailsComponent,
    LeadPartyAddressTabsComponent,
    LeadPartyContactComponent,
    LeadPartyEmploymentComponent,
    LeadPartyIdentityComponent,
    LeadPartyNationalityDetailComponent,
    LeadPartyOtherIncomeComponent,
    LeadPartyAddressComponent,
    LeadTestAPIStepFormHandlerComponent,
    LeadInsuranceStepFormComponent,
    LeadMainStepFormComponent,
    LeadOutputPreferenceComponent,
    ViewPolicyListComponent,
    LeadSearchDownloadComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SystemCommonModule,
    LeadRoutingModule,
    // ModalModule.forRoot(),
    BusinessCommonModule,
  ],
  exports: [
    LeadStepFormComponent,
    LeadBasicComponent,
    LeadActivityComponent,
    LeadPartyDetailsComponent,
    LeadPartyAddressTabsComponent,
    LeadPartyContactComponent,
    LeadPartyEmploymentComponent,
    LeadPartyIdentityComponent,
    LeadPartyNationalityDetailComponent,
    LeadPartyOtherIncomeComponent,
    LeadPartyAddressComponent,
    LeadTestAPIStepFormHandlerComponent,
    LeadSearchDownloadComponent,
  ],
  providers: [LeadService],
})
export class LeadModule {}
