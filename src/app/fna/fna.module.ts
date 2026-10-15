import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FNARoutingModule } from './fna-routing.module';
import { FnaStepFormComponent } from './fna-step-form/fna-step-form.component';
import { FnaService } from './service/fna-service.service';
import { SystemCommonModule } from '../system-common/system-common.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FnaPersonalInformationComponent } from './fna-personal-information/fna-personal-information.component';
import { FnaDreamComponent } from './fna-dream/fna-dream.component';
import { FnaBuyProductComponent } from './fna-buy-product/fna-buy-product.component';
import { FnaPremiumComponent } from './fna-premium/fna-premium.component';
import { FnaTimelineComponent } from './fna-timeline/fna-timeline.component';
import { FnaRecommendationComponent } from './fna-recommendation/fna-recommendation.component';
import { FnaProductSummaryComponent } from './fna-product-summary/fna-product-summary.component';
import { FnaRiskProfileComponent } from './fna-risk-profile/fna-risk-profile.component';
import { FnaSignatureComponent } from './fna-signature/fna-signature.component';
@NgModule({
  declarations: [
    FnaStepFormComponent,
    FnaPersonalInformationComponent,
    FnaDreamComponent,
    FnaBuyProductComponent,
    FnaPremiumComponent,
    FnaTimelineComponent,
    FnaRecommendationComponent,
    FnaProductSummaryComponent,
    FnaRiskProfileComponent,
    FnaSignatureComponent,
  ],
  imports: [CommonModule, FNARoutingModule, SystemCommonModule, FormsModule, DragDropModule],
  providers: [FnaService],
})
export class FNAModule {}
