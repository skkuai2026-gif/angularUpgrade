import { PolicyModule } from './../policy/policy.module';
import { CustomerPortalModule } from './../customer-portal/customer-portal.module';
import { BankQuotationBasePlanSelectionComponent } from './bank-quotation-base-plan-selection/bank-quotation-base-plan-selection.component';
import { BankQuotationCoverageComponent } from './bank-quotation-coverage/bank-quotation-coverage.component';
import { BankInsuranceTypeSelectComponent } from './bank-insurance-type-select/bank-insurance-type-select.component';
import { BankPortalRoutingModule } from './bank-portal-routing.module';
import { QuotationModule } from './../quotation/quotation.module';
import { SystemCommonModule } from './../system-common/system-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStepFormComponent } from './bank-step-form/bank-step-form.component';
import { BankQuotationComparisonComponent } from './bank-quotation-comparison/bank-quotation-comparison.component';
import { BusinessCommonModule } from '../business-common/business-common.module';

@NgModule({
  declarations: [
    BankStepFormComponent,
    BankInsuranceTypeSelectComponent,
    BankQuotationCoverageComponent,
    BankQuotationBasePlanSelectionComponent,
    BankQuotationComparisonComponent,
  ],
  imports: [
    CommonModule,
    SystemCommonModule,
    QuotationModule,
    BankPortalRoutingModule,
    CustomerPortalModule,
    PolicyModule,
    BusinessCommonModule,
  ],
})
export class BankPortalModule {}
