import { OccupationIndustryDutyService } from './service/occupation-industry-duty.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
// import { ChartsModule } from 'ng2-charts';
import { BusinessCommonRoutingModule } from './business-common-routing.module';
import { OccupationIndustryDutySearchComponent } from './occupation-industry-duty-search/occupation-industry-duty-search.component';
import { SystemCommonModule } from './../system-common/system-common.module';
import { BusinessCommonService } from './service/business-common.service';
import { AgentSearchComponent } from './agent-search/agent-search.component';
import { UserProfileComponentComponent } from './user-profile-component/user-profile-component.component';
import { InsuranceTypeSelectionComponent } from './insurance-type-selection/insurance-type-selection.component';
import { IndustryOccupationComponent } from './industry-occupation/industry-occupation.component';
import { AimlService } from './service/aiml.service';
@NgModule({
  declarations: [
    OccupationIndustryDutySearchComponent,
    AgentSearchComponent,
    UserProfileComponentComponent,
    InsuranceTypeSelectionComponent,
    IndustryOccupationComponent,
  ],
  imports: [
    CommonModule,
    BusinessCommonRoutingModule,
    FormsModule,
    SystemCommonModule,
    // ModalModule.forRoot(),
    // ChartsModule,
    // ChartModule,
  ],
  exports: [
    OccupationIndustryDutySearchComponent,
    AgentSearchComponent,
    UserProfileComponentComponent,
    InsuranceTypeSelectionComponent,
    IndustryOccupationComponent,
  ],
  providers: [BusinessCommonService, OccupationIndustryDutyService, AimlService],
})
export class BusinessCommonModule {}
