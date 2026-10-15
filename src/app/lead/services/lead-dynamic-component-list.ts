import { ButtonComponent } from 'src/app/system-common/button/button.component';
import { LeadActivityComponent } from '../lead-activity/lead-activity.component';
import { LeadBasicComponent } from '../lead-basic/lead-basic.component';
import { LeadPartyAddressTabsComponent } from '../lead-party-address-tabs/lead-party-address-tabs.component';
import { LeadPartyDetailsComponent } from '../lead-party-details/lead-party-details.component';
import { LeadPartyEmploymentComponent } from '../lead-party-employment/lead-party-employment.component';
import { LeadPartyIdentityComponent } from '../lead-party-identity/lead-party-identity.component';
import { LeadPartyNationalityDetailComponent } from '../lead-party-nationality-detail/lead-party-nationality-detail.component';
import { LeadPartyOtherIncomeComponent } from '../lead-party-other-income/lead-party-other-income.component';
import { LeadOutputPreferenceComponent } from '../lead-output-preference/lead-output-preference.component';
import { ViewCSAListComponent } from '../view-csa-list/view-csa-list.component';
import { ViewProposalListLeadComponent } from '../view-proposal-list-lead/view-proposal-list-lead.component';

export class LeadDynamicComponentList {
  static componentMap = {
    'sym-lead-basic': LeadBasicComponent,
    'sym-view-csa-list': ViewCSAListComponent,
    'sym-view-proposal-list-lead': ViewProposalListLeadComponent,
    'sym-lead-party-details': LeadPartyDetailsComponent,
    'sym-lead-party-employment': LeadPartyEmploymentComponent,
    'sym-lead-party-identity': LeadPartyIdentityComponent,
    'sym-lead-party-other-income': LeadPartyOtherIncomeComponent,
    'sym-lead-party-nationality-detail': LeadPartyNationalityDetailComponent,
    'sym-lead-activity': LeadActivityComponent,
    'sym-lead-party-address-tabs': LeadPartyAddressTabsComponent,
    'sym-button': ButtonComponent,
    'sym-lead-output-preference': LeadOutputPreferenceComponent,
  };
}
