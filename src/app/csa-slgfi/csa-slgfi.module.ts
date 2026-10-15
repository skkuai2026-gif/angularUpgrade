import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FnaDataComponent } from '../csa/fna-data/fna-data.component';
import { CSASLGFIRoutingModule } from './csa-slgfi-routing.module';
import { SystemCommonModule } from '../system-common/system-common.module';
import { CSASLGFIService } from './service/csa-slgfi-service.service';
import { CSASLGFIPreviewComponent } from './csa-slgfi-preview/csa-slgfi-preview.component';
import { CSASLGFIStepFormComponent } from './csa-slgfi-step-form/csa-slgfi-step-form.component';
import { FnaSLGFIDataComponent } from './fna-slgfi-data/fna-slgfi-data.component';
import { CSASLGFIRiskProfileComponent } from './csa-slgfi-risk-profile/csa-slgfi-risk-profile.component';
import { CSASLGFIDeclarationComponent } from './csa-slgfi-declaration/csa-slgfi-declaration.component';
import { ViewProposalListSLGFIComponent } from './view-proposal-list-slgfi/view-proposal-list-slgfi.component';
import { CSASLGFISearchComponent } from './csa-slgfi-search-form/csa-slgfi-search-form.component';
import { LinkExistingProposalSLGFIComponent } from './link-existing-proposal-slgfi/link-existing-proposal-slgfi.component';
import { FnaQuestionDetailsComponent } from './fna-question-details/fna-question-details.component';
import { FnaPersonalDetailsComponent } from './fna-personal-details/fna-personal-details.component';
import { CSASLGFIFundListComponent } from './csa-slgfi-fund-list/csa-slgfi-fund-list.component';
import { CSASLGFITestApiStepFormComponent } from './csa-slgfi-test-api-step-form/csa-slgfi-test-api-step-form.component';
import { FnaQuestionDetailsAPIComponent } from './fna-question-details-api/fna-question-details-api.component';
import { FnaSLGFIDataAPIComponent } from './fna-slgfi-data-api/fna-slgfi-data-api.component';

@NgModule({
  declarations: [
    CSASLGFIStepFormComponent,
    FnaSLGFIDataComponent,
    CSASLGFIRiskProfileComponent,
    CSASLGFIDeclarationComponent,
    ViewProposalListSLGFIComponent,
    CSASLGFISearchComponent,
    FnaQuestionDetailsComponent,
    CSASLGFIFundListComponent,
    FnaPersonalDetailsComponent,
    CSASLGFIPreviewComponent,
    LinkExistingProposalSLGFIComponent,
    CSASLGFITestApiStepFormComponent,
    FnaSLGFIDataAPIComponent,
    FnaQuestionDetailsAPIComponent,
  ],
  imports: [CommonModule, CSASLGFIRoutingModule, SystemCommonModule, FormsModule],
  exports: [
    CSASLGFIStepFormComponent,
    FnaQuestionDetailsComponent,
    CSASLGFIFundListComponent,
    FnaPersonalDetailsComponent,
    FnaSLGFIDataComponent,
    ViewProposalListSLGFIComponent,
    LinkExistingProposalSLGFIComponent,
    CSASLGFITestApiStepFormComponent,
    FnaSLGFIDataAPIComponent,
    FnaQuestionDetailsAPIComponent,
  ],
  providers: [CSASLGFIService],
})
export class CSASLGFIModule {}
