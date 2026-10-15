import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CSARoutingModule } from './csa-routing.module';
import { CSAStepFormComponent } from './csa-step-form/csa-step-form.component';
import { CSAService } from './service/csa-service.service';
import { SystemCommonModule } from '../system-common/system-common.module';
import { CSASearchComponent } from './csa-search-form/csa-search-form.component';
// import { NgDragDropModule } from 'ng-drag-drop';

import { FnaDataComponent } from './fna-data/fna-data.component';
import { CSARiskProfileComponent } from './csa-risk-profile/csa-risk-profile.component';
import { CSADeclarationComponent } from './csa-declaration/csa-declaration.component';
import { CSAPreviewComponent } from './csa-preview/csa-preview.component';
import { LinkExistingProposalComponent } from './link-existing-proposal/link-existing-proposal.component';
import { ViewProposalListComponent } from './view-proposal-list/view-proposal-list.component';
import { CSATestApiStepFormComponent } from './csa-test-api-step-form/csa-test-api-step-form.component';
@NgModule({
  declarations: [
    CSAStepFormComponent,
    FnaDataComponent,
    CSARiskProfileComponent,
    CSADeclarationComponent,
    ViewProposalListComponent,
    CSASearchComponent,
    CSAPreviewComponent,
    LinkExistingProposalComponent,
    CSATestApiStepFormComponent,
  ],
  imports: [CommonModule, CSARoutingModule, SystemCommonModule, FormsModule],
  exports: [
    CSAStepFormComponent,
    FnaDataComponent,
    CSAPreviewComponent,
    ViewProposalListComponent,
    LinkExistingProposalComponent,
    CSATestApiStepFormComponent,
  ],
  providers: [CSAService],
})
export class CSAModule {}
